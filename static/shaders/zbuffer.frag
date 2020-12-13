#ifdef GL_ES
precision mediump float;
#endif

varying vec3 varying_fragpos;

void main() {
	float depth = gl_FragCoord.z / gl_FragCoord.w;
	gl_FragColor = vec4(depth);
}
