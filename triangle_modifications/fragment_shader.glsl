#version 300 es
precision highp float;
in vec4 vColor;
out vec4  fragColor;
void main() {

// mudar as cores na metade do triângulo
if(gl_FragCoord.x > 120.0) // depende do canvas, da resolução do monitor
    fragColor = vColor + vec4(0.6, 0.6, 0.6, 0.0);
else
// contraste
    // fragColor.r = vColor.r * 2.0;
    // fragColor.g = vColor.g * 2.0;
    // fragColor.b = vColor.b * 2.0;
    // fragColor.a = vColor.a * 2.0;
    fragColor = vColor;


}