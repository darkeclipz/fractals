# Fractals
 
 View them with the [Fractal Viewer](https://darkeclipz.github.io/fractals/viewer/). Currently the following are implemented:
 
  * Burning ship + julia

# GLSL code for Mandelbrot

An attempt to create a short, and fast, implementation for the Mandelbrot set in GLSL. Currently it stands at 176 characters, which is a little more than half a tweet.

```glsl
#define R iResolution.xy
void mainImage( out vec4 O, in vec2 I ) {
    vec2 c = ( 2.*I - R ) / R.y, z = 0./R; 
    float i = 0.;
	for(; ++i <= 64. && dot(z,z) < 4. ;)
        z = mat2( z, -z.y, z.x ) * z + c;
    O = vec4(vec3( i / 64. ), 1.0);
}
```

You can test it at [Shadertoy](https://www.shadertoy.com/new).

# Screenshots

In the `screenshots` folder are the high-res pictures. :)

## Mandelbrot

![mandelbrot1.PNG](screenshots/mandelbrot1.PNG)
![mandelbrot2.PNG](screenshots/mandelbrot2.PNG)

## Julia

![julia1.PNG](screenshots/julia1.PNG)
![julia2.PNG](screenshots/julia2.PNG)
![julia3.PNG](screenshots/julia3.PNG)
![julia4.PNG](screenshots/julia4.PNG)
![julia5.PNG](screenshots/julia5.PNG)
![julia6.PNG](screenshots/julia6.PNG)
![julia7.PNG](screenshots/julia7.PNG)
![julia8.PNG](screenshots/julia8.PNG)
![julia9.PNG](screenshots/julia9.PNG)
![julia10.PNG](screenshots/julia10.PNG)
![julia11.PNG](screenshots/julia11.PNG)
![julia12.PNG](screenshots/julia12.PNG)
![julia13.PNG](screenshots/julia13.PNG)
![julia14.PNG](screenshots/julia14.PNG)
![julia15.PNG](screenshots/julia15.PNG)
![julia16.PNG](screenshots/julia16.PNG)
![julia17.PNG](screenshots/julia17.PNG)
![julia18.PNG](screenshots/julia18.PNG)
![julia19.PNG](screenshots/julia19.PNG)
![julia20.PNG](screenshots/julia20.PNG)
![julia21.PNG](screenshots/julia21.PNG)

## Burning ship

![bship.PNG](screenshots/bship.PNG)

## Burning ship (Julia)

![bshipjulia.PNG](screenshots/bshipjulia.PNG)
![bshipjulia2.PNG](screenshots/bshipjulia2.PNG)
![bshipjulia3.PNG](screenshots/bshipjulia3.PNG)
![bshipjulia4.PNG](screenshots/bshipjulia4.PNG)
![bshipjulia5.PNG](screenshots/bshipjulia5.PNG)
![bshipjulia6.PNG](screenshots/bshipjulia6.PNG)
![bshipjulia7.PNG](screenshots/bshipjulia7.PNG)
![bshipjulia8.PNG](screenshots/bshipjulia8.PNG)
![bshipjulia9.PNG](screenshots/bshipjulia9.PNG)
![bshipjulia10.PNG](screenshots/bshipjulia10.PNG)
![bshipjulia11.PNG](screenshots/bshipjulia11.PNG)
![bshipjulia13.PNG](screenshots/bshipjulia13.PNG)

 # GLSL code
 
 Implementations of the fractals on ShaderToy:

 * https://www.shadertoy.com/view/MltyR8
 * https://www.shadertoy.com/view/XlcyR4
 * https://www.shadertoy.com/view/Xl3cR4
 * https://www.shadertoy.com/view/MtccR4
 * https://www.shadertoy.com/view/ltccRN
