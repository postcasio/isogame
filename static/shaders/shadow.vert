attribute vec4 al_color;
attribute vec4 al_pos;
attribute vec2 al_texcoord;
uniform mat4 al_projview_matrix;

uniform mat4 model;
uniform mat4 normal;
uniform mat4 projection;

// input to fragment shader
varying vec4 varying_color;
varying vec2 varying_texcoord;
varying vec3 varying_fragpos;
varying vec3 varying_normal;

mat3 m3( mat4 m )
{
mat3 result;

result[0][0] = m[0][0];
result[0][1] = m[0][1];
result[0][2] = m[0][2];
result[1][0] = m[1][0];
result[1][1] = m[1][1];
result[1][2] = m[1][2];
result[2][0] = m[2][0];
result[2][1] = m[2][1];
result[2][2] = m[2][2];

return result;
}

void main()
{
	gl_Position = projection * model * vec4(al_pos.xyz, 1.0);
}
