uniform float iTime;
uniform vec2 iResolution;

#define AA 32.
#define MAX_ITER 1024.
#define THRESHOLD 64.
#define LN2 0.6931471806

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
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
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


float bship(vec2 uv) {
    
    vec2 c = vec2(0.5971,-0.9370);
    
    vec2 z = uv ; 
    float i = 0.;
    
    for(float j=0.; j < MAX_ITER ; j++) {
        // z = ( |Re(z)| + i|Im(z)| )^2   
        z = abs(z);
        z = mat2(z, -z.y, z.x) * z + c;
        if( dot(z,z) > THRESHOLD ) break;
        i=j;
    }
    
    return i - log(log(dot(z,z))/LN2)/LN2;	    
}

varying vec2 vUv; 
void main(void)
{
    vec2 fragCoord = vUv * iResolution;

    vec2 R = iResolution;

    palette pal = palette_blue();
    
    vec3 col = vec3(0);
    float a = 3.141592654/2.;
    mat2 r = mat2(cos(a),sin(a),-sin(a),cos(a));

    for(float i=0.; i < AA; i++) {
        
        vec2 p = 1.6*r*((2.*fragCoord-R+nextRand2()+0.0001)/R.y);
        float orbit = bship(p) / MAX_ITER;
        float f = fract( 10.*orbit );
        col += cmap( fract(f + iTime/10. )-0.0001 , pal); 
    }
    
    col /= AA;

    gl_FragColor = vec4(col, 1.0);
}