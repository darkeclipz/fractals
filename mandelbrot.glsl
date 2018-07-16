// Palette

struct palette {
    vec3 c0, c1, c2, c3, c4;
};

palette palette_red_accented() {
    palette p; 
    p.c0 = vec3(0,0,16)/255.;
    p.c1 = vec3(202,202,200)/255.;
    p.c2 = vec3(255)/255.;
    p.c3 = vec3(182,132,107)/255.;
    p.c4 = vec3(247,49,73)/255.;
    return p;    
}

    
palette palette_calm_blue() {
    palette p; 
    p.c0 = vec3(5,8,49)/255.;
    p.c1 = vec3(19,48,114)/255.;
    p.c2 = vec3(213,230,247)/255.;
    p.c3 = vec3(213,230,247)/255.;
    p.c4 = vec3(5,8,49)/255.;
    return p;    
}
    
palette palette_green() {
    palette p; 
    p.c0 = vec3(0,120,122)/255.;
    p.c1 = vec3(148,235,216)/255.;
    p.c2 = vec3(0,179,73)/255.;
    p.c3 = vec3(0,121,57)/255.;
    p.c4 = vec3(0,61,52)/255.;
    return p;    
}

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
    col = mix( col, p.c0, smoothstep(.8, 1.,  t));
    return col;
}

//#define MAX_ITER 1024.
#define MAX_ITER 512.
#define THRESHOLD 16.
float mandelbrot(vec2 uv) {
    
	vec2 c = 2.5*(uv - vec2(.2,0)); 
    vec2 z = vec2(0); 
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
        
    palette pal = palette_blue();
    
    vec3 col = vec3(0);

    for(float i=0.; i < SAMPLES; i++) {
        vec2 p = 0.00017*(2.*fragCoord-R+nextRand2())/R.y-vec2(-0.35209,0.09199) ;
        float orbit = mandelbrot(p) / MAX_ITER;
    	col += cmap( fract(3.5* orbit + iTime/8. ) , pal ); 
    }
    
    col /= SAMPLES;

    fragColor = vec4(col, 1.);
}