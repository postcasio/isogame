#ifdef GL_ES
precision mediump float;
#endif

uniform bool al_use_tex;
uniform sampler2D al_tex;
uniform sampler2D zbuffer;

uniform float focusDepth;
uniform vec2 texSize;

varying vec2 varying_texcoord;
varying vec4 varying_color;

uniform float maxBlur; // max blur amount
uniform float aperture; // aperture - bigger values for shallower depth of field


vec4 texLookup(vec2 coords) {
	return al_use_tex ? texture2D(al_tex, fract(coords)) : vec4(1.0);
}

void main() {
    vec2 vUv = varying_texcoord;

    vec2 aspectcorrect = vec2( 1.0, texSize.y / texSize.x );

    vec4 depth1 = texture2D( zbuffer, vUv );

    float factor = depth1.x - focusDepth;

    vec2 dofblur = vec2 ( clamp( factor * aperture, -maxBlur, maxBlur ) );

    vec2 dofblur9 = dofblur * 0.9;
    vec2 dofblur7 = dofblur * 0.7;
    vec2 dofblur4 = dofblur * 0.4;

    vec4 col = vec4( 0.0 );

    col += texLookup( vUv.xy );
    col += texLookup( vUv.xy + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.15, 0.37 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.37, 0.15 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.40, 0.0 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.37, -0.15 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.15, 0.37 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.37, 0.15 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
    col += texLookup( vUv.xy + ( vec2( 0.15, -0.37 ) * aspectcorrect ) * dofblur );

    col += texLookup( vUv.xy + ( vec2( 0.15, 0.37 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( -0.37, 0.15 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( 0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( -0.15, 0.37 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( 0.37, 0.15 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    col += texLookup( vUv.xy + ( vec2( 0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

    col += texLookup( vUv.xy + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( 0.40, 0.0 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    col += texLookup( vUv.xy + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur7 );

    col += texLookup( vUv.xy + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( 0.4, 0.0 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    col += texLookup( vUv.xy + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur4 );

    gl_FragColor = col / 41.0;
    gl_FragColor.a = 1.0;
}
