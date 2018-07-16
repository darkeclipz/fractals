// resources:
// - http://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
// - http://colorpalettes.net/color-palette-3885/

// Color palettes
struct palette {
    vec3 c0, c1, c2, c3, c4;
};

palette palette1() {
    palette p;
    p.c0 = vec3(0);
    p.c1 = vec3(190,220,227)/255.;
    p.c2 = vec3(243,243,246)/255.;
    p.c3 = vec3(227,220,213)/255.;
    p.c4 = vec3(218,112, 21)/255.;
    return p;
}

palette palette2() {
    palette p; p.c0 = vec3(0,2,5)/255.;
    p.c1 = vec3(8,45,58)/255.;
    p.c2 = vec3(38,116,145)/255.;
    p.c3 = vec3(167,184,181)/255.;
    p.c4 = vec3(207,197,188)/255.;
    return p;    
}

// Complex math

vec2 cpow ( vec2 z ) { return mat2(z, -z.y, z.x) * z; }
//vec2 cmul( vec2 z1, vec2 z2 ) { return vec2( z1.x*z2.x -z1.y*z2.y, 2.*z1.x*z1.y ); } + z2.x*z2.y :/
//vec2 cmul( vec2 z1, vec2 z2 ) { return mat2(z2, -z2.y, z2.x) * z1; }
vec2 cmul( vec2 z1, vec2 z2 ) { return mat2(z1, -z1.y, z1.x) * z2; }

/* missed one iter
vec2 cpown (vec2 z, int n) {
    mat2 m = mat2(z, -z.y, z.x);
    for(int i=0; i<n;++i) 
    	z *= m;
   	return z;
}*/
vec2 cpown (vec2 z, int n) {
    mat2 m = mat2(z, -z.y, z.x);
    for(;--n>0;) z *= m;
   	return z;
}

float cmod( vec2 z ) {
	//return ri.x * ri.x + ri.y * ri.y;    
    return dot(z,z);
}

// Mapping

#define ZOOM
vec2 map ( vec2 uv ) {
    #ifdef ZOOM
    return 1./exp(mod(iTime/2.,80.))*uv;
    #else
	return 2.*uv;
    #endif
}

vec3 cmap( float t, palette p ) {
    //t=fract(t);
    vec3 col = vec3(0);
    col = mix( p.c0,  p.c1, smoothstep(0. , .2, t));
    col = mix( col, p.c2, smoothstep(.2, .4 , t));
    col = mix( col, p.c3, smoothstep(.4 , .6, t));
    col = mix( col, p.c4, smoothstep(.6,  .8, t));
    col = mix( col, vec3(0), smoothstep(.8, 1.,  t));
    return col;
}


// Polynomials

vec2 fMandelbrot( vec2 z, vec2 c) { return cpow(z) + c; }
vec2 fCPoly1 ( vec2 z, vec2 c ) { return cpown(z,11) + cmul((vec2(1.,0.)-c),cpown(z,5)) + cmul((c+1.+vec2(0,1)),z) + c; }
vec2 fCPoly2 ( vec2 z, vec2 c ) { return cpown(z,5) + cmul((vec2(1.,0.)-c),cpown(z,3)) + cmul((c+1.+vec2(0,1)),z) + c; }

//Display the color map.
//#define CMAP
#define ROTATE

// Main

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    palette p = palette2(); // palette1
    #ifdef CMAP
    fragColor = vec4(cmap(fragCoord.x/iResolution.x, p), 1.); return; 
    #endif
    
    float t = iTime/4.;
    vec2 R = iResolution.xy;
    vec2 uv = (2.*fragCoord-R)/iResolution.y;
    
    #ifdef ROTATE
    float angle = -2.*t;
    mat2 rot = mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
    uv*=rot;
    #endif
    
	vec3 col = vec3(0);
    vec2 z = vec2(0);
    vec2 c = map(uv);
    float n = 0.;
    float threshold = 4.;
    float maxIter = 200.;
    
    for(; n++ < maxIter ;) {
        z = fCPoly1(z,c);
        if(cmod(z) > threshold) break;
    }
    
    float sn = n-log(log(dot(z,z))/log(11.))/log(11.);
    col = cmap( fract(sn + t), p ); 
    
    fragColor = vec4(col,1.0);
}