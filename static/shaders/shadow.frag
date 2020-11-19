#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D al_tex;
uniform bool al_use_tex;

varying vec4 varying_color;
varying vec2 varying_texcoord;
varying vec3 varying_fragpos;
varying vec3 varying_normal;

void main() {
	float depth = gl_FragCoord.z;

	gl_FragColor = vec4(vec3(depth), 1.0);
}
