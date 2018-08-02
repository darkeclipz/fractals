declare var THREE;
declare var Vue;


interface TUniform {
    u_time;
    u_resolution;
    u_mouse;
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

    constructor(canvasId: string, vueId: string) {

        this.canvasId = canvasId;
        this.vueId = vueId;
        console.log('Rendering to canvas', this.canvasId);

        this.initVue();
        this.initThree();

    }

    initVue() {

        this.vue = new Vue({
            el: '#' + this.vueId,
            data: {
                message: 'Hello Vue!'
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
            u_mouse: { type: "v2", value: new THREE.Vector2() }
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
        window.addEventListener( 'resize', () => this.onWindowResize, false );

        console.log('Three initialized!');

    }

    public render() {

        this.uniforms.u_time.value += 0.05;
        this.vue.message = 'T: ' + this.uniforms.u_time.value;
        this.renderer.render(this.scene, this.camera);

    }

    onWindowResize( event? ) {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    }

}