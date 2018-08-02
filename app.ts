declare var THREE;
declare var Vue;


interface TUniform {
    u_time;
    u_resolution;
    u_mouse;
    u_julia;
    u_position;
    u_rotation;
    u_zoom;
    u_samples;
    u_max_iter;
    u_threshold;
    u_animate;
    u_animate_speed;
}

enum Key {
    W = 87, A = 65, S = 83, D = 68, R = 82, E = 69, Q = 81, F = 70,
    T = 84, G = 71
}

class Controls {

    keysDown: boolean[];
    keysToggled: boolean[];

    constructor() {

        this.keysDown = new Array<boolean>(252);
        this.keysToggled = new Array<boolean>(255);
        document.addEventListener("keydown", () => this.keydownCallback(), false);
        document.addEventListener("keyup", () => this.keyupCallback(), false);
        console.log('Controls initialized!');

    }

    public getKeyDown(key: number) {

        if(key >= 255) return;
        return this.keysDown[key];

    }

    public getKeyToggled(key: number) {

        if(key >= 255) return;
        return this.keysToggled[key];

    }

    keydownCallback(e?: KeyboardEvent) {

        e = <KeyboardEvent>event;
        if(e.keyCode >= 255) return;
        this.keysDown[e.keyCode] = true;
        this.keysToggled[e.keyCode] = !this.keysToggled[e.keyCode];

    }

    keyupCallback(e?: KeyboardEvent) {

        e = <KeyboardEvent>event;
        if(e.keyCode >= 255) return;
        this.keysDown[e.keyCode] = false;

    }

}

class FractalViewer {

    // Vue
    private vueId;
    private vue;

    // Three 
    private canvasId;
    private container;
    private camera;
    private scene;
    private renderer;
    private uniforms: TUniform;

    private controls: Controls;

    constructor(canvasId: string, vueId: string) {

        this.canvasId = canvasId;
        this.vueId = vueId;
        console.log('Rendering to canvas', this.canvasId);

        this.initVue();
        this.initThree();

        this.controls = new Controls();

    }

    initVue() {

        this.vue = new Vue({
            el: '#' + this.vueId,
            data: {
                fractal: ['Burning ship'],
                julia: true,
                time: 0,
                position: new THREE.Vector2(0),
                zoom: 1.6,
                samples: 8,
                maxIterations: 300,
                threshold: 128,
                rotation: 90,
                animate: true,
                animationSpeed: 0.1
            }
        });

        console.log('Vue initialized!');

    }

    initThree() {

        this.container = document.getElementById(this.canvasId);

        this.camera = new THREE.Camera();
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        var geometry = new THREE.PlaneBufferGeometry(2, 2);

        this.uniforms = {
            u_time: { type: 'f', value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_mouse: { type: "v2", value: new THREE.Vector2() },
            u_julia: { type: "b", value: false },
            u_position: { type: "v2", value: new THREE.Vector2(0) },
            u_rotation: { type: "f", value: 0. },
            u_zoom: { type: "f", value: 1.6 },
            u_samples: { type: "f", value: 1. },
            u_max_iter: { type: "f", value: 64. },
            u_threshold: { type: "f", value: 64. },
            u_animate: { type: "b", value: true },
            u_animate_speed: { type: "f", value: 1. }
        };

        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild(this.renderer.domElement);
        
        this.onWindowResize();
        window.addEventListener( 'resize', () => this.onWindowResize(), false );

        console.log('Three initialized!');

    }

    public render() {

        this.handleKeys();

        // Dont send anything higher to the GPU, or it crashes.
        if(this.vue.samples > 512) {
            console.warn('Too many samples, max is 512!');
            return;
        }

        if(this.vue.max_iter > 5000) {
            console.warn('Too many iterations, max is 5000!');
            return;
        }

        this.uniforms.u_position.value.x = this.vue.position.x;
        this.uniforms.u_position.value.y = this.vue.position.y;
        this.uniforms.u_julia.value = this.vue.julia;
        this.uniforms.u_rotation.value = this.vue.rotation * Math.PI / 180;
        this.uniforms.u_zoom.value = this.vue.zoom;
        this.uniforms.u_samples.value = this.vue.samples;
        this.uniforms.u_max_iter.value = this.vue.maxIterations,
        this.uniforms.u_threshold.value = this.vue.threshold;
        this.uniforms.u_time.value += 0.05;
        this.uniforms.u_animate.value = this.vue.animate;
        this.uniforms.u_animate_speed.value = this.vue.animationSpeed;
        this.vue.time = this.round(this.uniforms.u_time.value, 1);

        
        this.renderer.render(this.scene, this.camera);

    }

    onWindowResize( event? ) {

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    
    }

    round(x: number, n: number = 0) {

        if(n == 0) return Math.round(x);
        let base10 = Math.pow(10, n);
        return Math.round(x * base10) / base10;

    } 

    handleKeys() {

        if( this.controls.getKeyDown(Key.W) ) this.vue.position.y += 0.02 * this.vue.zoom;
        if( this.controls.getKeyDown(Key.S) ) this.vue.position.y -= 0.02 * this.vue.zoom;
        if( this.controls.getKeyDown(Key.A) ) this.vue.position.x -= 0.02 * this.vue.zoom;
        if( this.controls.getKeyDown(Key.D) ) this.vue.position.x += 0.02 * this.vue.zoom;
        if( this.controls.getKeyDown(Key.Q) ) this.vue.zoom += 0.02 * this.vue.zoom;
        if( this.controls.getKeyDown(Key.E) ) this.vue.zoom -= 0.02 * this.vue.zoom;
        if( this.controls.getKeyDown(Key.R) ) this.vue.rotation += 1;
        if( this.controls.getKeyDown(Key.F) ) this.vue.rotation -= 1;
        if( this.controls.getKeyDown(Key.T) ) this.vue.maxIterations += 5;
        if( this.controls.getKeyDown(Key.G) ) this.vue.maxIterations -= 5;

    }

}

