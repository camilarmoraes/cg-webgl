#version 300 es
precision highp float;
in vec4 vColor;
out vec4  fragColor;
void main() {

    // contraste
    fragColor.r = vColor.r * 2.0;
    fragColor.g = vColor.g * 2.0;
    fragColor.b = vColor.b * 2.0;
    fragColor.a = vColor.a * 2.0;

}