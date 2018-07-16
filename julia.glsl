// Palette

struct palette {
    vec3 c0, c1, c2, c3, c4;
};

palette palette_blue() {
    palette p; 
    p.c0 = vec3(0,2,5)/255.;
    p.c1 = vec3(8,45,58)/255.;
    p.c2 = vec3(38,116,145)/255.;
    p.c3 = vec3(167,184,181)/255.;
    p.c4 = vec3(207,197,188)/255.;
    return p;    
}

// Random

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 1.5;
        amplitude *= .5;
    }
    return value;
}

float randSeed = 0.;
vec2 nextRand2() {
    vec2 v = vec2( randSeed++, randSeed++ );
	return vec2( random( v+0.34 ), random( v+0.75 ) );    
}

// Mapping

vec3 cmap( float t, palette p ) {
    vec3 col = vec3(0);
    col = mix( p.c0,  p.c1, smoothstep(0. , .2, t));
    col = mix( col, p.c2, smoothstep(.2, .4 , t));
    col = mix( col, p.c3, smoothstep(.4 , .6, t));
    col = mix( col, p.c4, smoothstep(.6,  .8, t));
    col = mix( col, vec3(0), smoothstep(.8, 1.,  t));
    return col;
}

#define MAX_ITER 128.
#define THRESHOLD 16.
float julia(vec2 uv) {
    
    vec2 R = iResolution.xy;
    
    vec2 c = iMouse.x + iMouse.y == 0. 
        ? vec2(0.355) 
        : (2.*iMouse.xy-R)/R.y;
    
    vec2 z = 2.5*uv; 
    float i = 0.;
    
    for(; ++i <= MAX_ITER ;) {
        z = mat2(z, -z.y, z.x) * z + c;
    	if( dot(z,z) > THRESHOLD ) break;
	}
  
    return i - log(log(dot(z,z))/log(2.))/log(2.);		    
}

// Main

#define SAMPLES 8.
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    
    vec2 R = iResolution.xy;
    vec3 col = vec3(0);
    palette pal = palette_blue();
    
    for(float i=0.; i < SAMPLES; i++) {
        vec2 p = 0.5*(2.*fragCoord-R+nextRand2())/R.y ;
        float orbit = julia(p) / MAX_ITER;
    	col += cmap( fract(2.*orbit)-0.01 , pal ); 
    }
    
    col /= SAMPLES;

    fragColor = vec4(col, 1.);
}