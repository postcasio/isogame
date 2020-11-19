#ifdef GL_ES
precision mediump float;
#endif

#define MAX_POINT_LIGHTS 4
#define MAX_DIR_LIGHTS 4
#define PCF
#define WITH_NORMALMAP_UNSIGNED

#define AMBIENT_LIGHT 0.1

// struct PointLight {
// 	bool enabled;
// 	vec3 position;
// 	vec3 color;
// 	float intensity;
// 	int lightIndex;
// 	sampler2D shadowMap;
// };

struct DirectionalLight {
	bool enabled;
	vec3 position;
	vec3 color;
	float intensity;
	int lightIndex;
};

struct Material {
	vec3 color;
	float shininess;
	float roughness;
	float opacity;
	bool transparent;
	vec2 uvScale;

};

uniform bool material_use_specular;
uniform sampler2D material_specular;
uniform bool material_use_normal;
uniform sampler2D material_normal;

uniform sampler2D al_tex;
uniform bool al_use_tex;

// uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform DirectionalLight dirLights[MAX_DIR_LIGHTS];
uniform sampler2D shadowMap0;
uniform sampler2D shadowMap1;
uniform sampler2D shadowMap2;
uniform sampler2D shadowMap3;

uniform Material material;
uniform vec3 viewPos;
uniform float shadowMapSize;

uniform bool editor;
uniform bool editorHovered;
uniform bool editorSelected;
uniform float editorGrid;

varying vec4 varying_color;
varying vec2 varying_texcoord;
varying vec3 varying_fragpos;
varying vec3 varying_normal;
varying vec4 varying_fragposLightSpace[MAX_DIR_LIGHTS];

float shadowMapLookup(int lightIndex, vec2 coords) {
	if (lightIndex == 3) {
		return texture2D(shadowMap3, coords).r;
	} else if (lightIndex == 2) {
		return texture2D(shadowMap2, coords).r;
	} else if (lightIndex == 1) {
		return texture2D(shadowMap1, coords).r;
	} else {
		return texture2D(shadowMap0, coords).r;
	}
}

float specularMapLookup(vec2 coords) {
	return material_use_specular ? texture2D(material_specular, fract(coords * material.uvScale)).r : 1.0;
}

vec3 normalMapLookup(vec2 coords) {
	return material_use_normal ? texture2D(material_normal, fract(coords * material.uvScale)).xyz : vec3(1.0);
}

vec3 diffuseMapLookup(vec2 coords) {
	return al_use_tex ? texture2D(al_tex, fract(coords * material.uvScale)).xyz : material.color;
}

mat3 cotangent_frame( vec3 N, vec3 p, vec2 uv ) {
	// get edge vectors of the pixel triangle
	vec3 dp1 = dFdx( p ); vec3 dp2 = dFdy( p ); vec2 duv1 = dFdx( uv ); vec2 duv2 = dFdy( uv );   // solve the linear system
	vec3 dp2perp = cross( dp2, N ); vec3 dp1perp = cross( N, dp1 ); vec3 T = dp2perp * duv1.x + dp1perp * duv2.x; vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
	// construct a scale-invariant frame
	float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
	return mat3( T * invmax, B * invmax, N );
	}

vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord )
{
	if (!material_use_normal) {
		return N;
	}

    // assume N, the interpolated vertex normal and
    // V, the view vector (vertex to eye)
    vec3 map = normalMapLookup(texcoord);
#ifdef WITH_NORMALMAP_UNSIGNED
    map = map * 255./127. - 128./127.;
#endif
#ifdef WITH_NORMALMAP_2CHANNEL
    map.z = sqrt( 1. - dot( map.xy, map.xy ) );
#endif
#ifdef WITH_NORMALMAP_GREEN_UP
    map.y = -map.y;
#endif
    mat3 TBN = cotangent_frame( N, -V, texcoord );
    return normalize( TBN * map );
}

float ShadowCalculation(int lightIndex, vec3 normal, vec3 lightDir)
{
	vec4 fragPosLightSpace = varying_fragposLightSpace[lightIndex];
	if (material.transparent) {
		return 0.0;
	}

	vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
	projCoords = projCoords * 0.5 + 0.5;

	float currentDepth = projCoords.z;

#ifdef PCF
	float bias = max(0.003 * (1.0 - dot(normal, lightDir)), 0.003);
	float shadow = 0.0;
	vec2 texelSize = 1.0 / vec2(shadowMapSize);

	for(int x = -1; x <= 1; ++x)
	{
		for(int y = -1; y <= 1; ++y)
		{
			float pcfDepth = shadowMapLookup(lightIndex, projCoords.xy + vec2(x, y) * texelSize);
			shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;
		}
	}
	shadow /= 9.0;
#endif
#ifndef PCF
	float bias = max(0.005 * (1.0 - dot(normal, lightDir)), 0.002);
	float closestDepth = shadowMapLookup(lightIndex, projCoords.xy);
	float shadow = currentDepth - bias > closestDepth  ? 1.0 : 0.0;
#endif

	if(projCoords.z > 1.0)
        shadow = 0.0;

	return shadow;
}

// vec3 calculatePointLight(PointLight light, vec3 normal, vec3 fragPos) {
// 	vec3 color = light.color * light.intensity;
// 	float ambientStrength = AMBIENT_LIGHT;
//     vec3 ambient = ambientStrength * color;

// 	vec3 lightDir = normalize(light.position - fragPos);

// 	float diff = max(dot(normalize(normal), lightDir), 0.0);
// 	vec3 diffuse = diff * color;

// 	float specularStrength = material.shininess;
// 	vec3 viewDir = normalize(viewPos - fragPos);
// 	vec3 reflectDir = reflect(-lightDir, normal);

// 	float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
// 	vec3 specular = specularStrength * spec * color;
// 	float shadow = 0.0;

// 	shadow = ShadowCalculation(light.lightIndex, varying_fragposLightSpace[light.lightIndex], normal, lightDir);
//     vec3 lighting = (ambient + (1.0 - shadow) * (diffuse + specular)) * material.color.xyz;

// 	// return vec3(shadow);

// 	return lighting;
// }



vec3 calculateDirectionalLight(DirectionalLight light, vec3 normal, vec3 fragPos) {
	vec3 viewDir = normalize(viewPos - fragPos);
	normal = perturb_normal(normal, viewDir, varying_texcoord * material.uvScale);
	float ambientStrength = AMBIENT_LIGHT;
	vec3 color = light.color * light.intensity;
    vec3 ambient = ambientStrength * color;

	vec3 lightDir = normalize(light.position);

	float diff = max(dot(normalize(normal), lightDir), 0.0);
	vec3 diffuse = diff * color;

	float specularStrength = material.shininess * specularMapLookup(varying_texcoord);

	vec3 reflectDir = reflect(-lightDir, normal);

	float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
	vec3 specular = specularStrength * spec * color;

	float shadow = 0.0;

	shadow = ShadowCalculation(light.lightIndex, normal, lightDir);
    vec3 lighting = (ambient + (1.0 - shadow) * (diffuse + specular)) * diffuseMapLookup(varying_texcoord);

	// return (light.lightSpaceMatrix * vec4(varying_fragpos, 1.0)).xyz;
	return lighting;
}

void main() {
	vec3 result = vec3(0.0);
	vec3 normal = varying_normal;

    // for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
	// 	if (!pointLights[i].enabled) {
	// 		break;
	// 	}

	// 	result += calculatePointLight(pointLights[i], normal, varying_fragpos);
	// }

	for (int i = 0; i < MAX_DIR_LIGHTS; i++) {
		if (!dirLights[i].enabled) {
			break;
		}

		result += calculateDirectionalLight(dirLights[i], normal, varying_fragpos);
	}

	gl_FragColor = vec4(result, 1.0);


	if (editorHovered) {
		gl_FragColor = mix(gl_FragColor, vec4(0.7, 0.7, 0.3, 1.0), 0.5);
	}

	float editorGridForce = editorGrid > 0.0 ? editorGrid : editorSelected ? 1.0 : 0.0;

	if (editorGridForce > 0.0) {
		vec3 coord = (varying_fragpos.xyz + vec3(0.5, 0.0, 0.5)) / editorGridForce;
		vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
		float line = min(grid.x, min(grid.y, grid.z));
		gl_FragColor = mix(gl_FragColor, editorSelected ? vec4(1.0, 1.0, 0.3, 1.0) : vec4(0.5, 0.5, 0.5, 1.0), 1.0 - min(line, 1.0));
	}

	gl_FragColor.w = material.opacity;

	// gl_FragColor = texture2D(material_specular, varying_texcoord);
}
