#version 300 es
precision highp float;
in vec4 position;
in vec4 color;
out vec4 vColor;
void main() {

// mudar a escala do ponto
    mat4 scale;
    scale = mat4(0.5, 0, 0, 0,
                    0, 0.5, 0, 0,
                    0, 0, 0.5, 0,
                    0, 0, 0, 1.0
                    );
    // deslocar para a direita
    vec4 desloc = vec4(0.5, 0.0, 0.0, 0.0);

    // rotacao em 180 graus
    mat4 rot = mat4(
                -1.0, 0, 0, 0,
                0, -1.0, 0, 0,
                0, 0, 1.0, 0,
                0, 0, 0, 1.0);

    vColor = color;

    // multiplicar pela position que multiplica pela rotacao e soma com o deslocamento
    gl_Position = scale * rot * position + desloc;
    // gl_Position = position;

}