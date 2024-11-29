async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader from ${url}: ${response.statusText}`);
    }
    return response.text();
}

async function main() {
    let canvas = document.getElementById("webgl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let aspect= canvas.width/canvas.height;
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error("WebGL 2 not available");
        document.body.innerHTML = "This example requires WebGL 2 which is unavailable on this system.";
        return;
    }
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    // Carregando os shaders
    // carregar os shaders antes de compilá-los
    const vsSource = await loadShaderSource('vertex_shader.glsl');
    const fsSource = await loadShaderSource('fragment_shader.glsl');

    // compilando shaders
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
        return;
    }
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // linkando os shaders ao programa
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

       // coordenadas do webgl são no sentido horário

       let vertex = [
        vec4(0.0, 0.5, 0.0, 1.0), // z = 0, a = 1.0
        vec4(0.5, -0.5, 0.0, 1.0),
        vec4(-0.5, -0.5, 0.0, 1.0),
    ];
    let colors = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0), // a = 1.0 -> transparência
        vec4(0.0, 0.0, 1.0, 1.0),
    ]; // será realizado uma interpolação

    // definindo arrays para enviar para a gpu
    let positionArray = []; // todas as posições dos vértices
    positionArray.push(vertex[0]);
    positionArray.push(vertex[1]);
    positionArray.push(vertex[2]);

    let colorArray = [];
    colorArray.push(colors[0]);
    colorArray.push(colors[1]);
    colorArray.push(colors[2]);

    // definir buffers
    let positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionArray), gl.STATIC_DRAW); // postionBuffer sendo linkado por um pointeiro invisível
    let positionLoc = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0); // ativar variável no programa -> alguns dados não sãio visíveis para alguns shaders
    gl.enableVertexAttribArray(positionLoc);

    let colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW); // postionBuffer sendo lincado por um pointeiro invisível
    let colorLoc = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0); // ativar variável no programa -> alguns dados não sãio visíveis para alguns shaders
    gl.enableVertexAttribArray(colorLoc);


    // posição da câmera
    let eye = vec3(0, 0 , 4); // 4 é definido através da perspective
    let target = vec3(0, 0, 0);
    let up = vec3(0, 1, 0);

    let viewMatrix = lookAt(eye, target, up);

    // matriz de projeção
    let projectMatrix = perspective(45, aspect, 1, 5);
    let mvp = mult(projectMatrix, viewMatrix);
    //enviar para a gpu
    let mvpLoc = gl.getUniformLocation(program, "mvp");
    gl.uniformMatrix4fv(mvpLoc, false, flatten(mvp)); //não precisa de enable
    
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(render);
    }
    render();
}

main();