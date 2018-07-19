// //https://stackoverflow.com/questions/24820004/how-to-implement-a-shadertoy-shader-in-three-js
import * as THREE from 'three';

interface TUniform {
    iTime;
    iResolution;
}

export class App {

    shaderVertexPath: string = "shaders/vertex_Projection.glsl";
    shaderBurningShipJulia: string = "shaders/fragment_BurningShipJulia.glsl";

    vertexShader: string = "";
    fragmentShader: string = "";

    renderer: THREE.WebGLRenderer;

    scene: THREE.Scene;
    camera: THREE.Camera;
    play: boolean = true;

    lastFrameTime: number;

    tUniform: TUniform;

    constructor() {

        this.load();

    }

    loadShader(path: string, callback: Function): void {

        let client = new XMLHttpRequest();
        client.open('GET', path);

        client.onreadystatechange = () => {
            callback(client.responseText);
        };

        client.send();

    }

    createScene(): void {

        this.scene = new THREE.Scene();

        let material = new THREE.ShaderMaterial({
            uniforms: this.tUniform,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,            
            side:THREE.DoubleSide
        });

        let plane = new THREE.Mesh( new THREE.PlaneGeometry(700, 394,1,1), material);
        this.scene.add(plane);

    }

    createRenderer(): void {

        if(this.renderer != null) {
            console.log('Renderer already created.');
            return;
        }

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 200;
        this.tUniform = {
            iTime: { type: 'f', value: 0.1 },
            iResolution: { type: 'vec2', value: { x: window.innerWidth, y: window.innerHeight }}
        };

    }

    render(): void {

        if(this.play) {
            requestAnimationFrame(() => this.render);
        }

        let currentTime = +new Date();
        let timePassed = this.lastFrameTime - currentTime;
        this.lastFrameTime = currentTime;
        this.tUniform.iTime.value += timePassed / 1000;

        this.renderer.render(this.scene, this.camera);

    }

    start(): void {

        console.log('Renderer started.')
        this.play = true;
        this.render();

    }

    stop(): void {

        console.log('Renderer stopped.')
        this.play = false;

    }

    load(): void {

        this.loadShader(this.shaderVertexPath, (glsl) => {
            console.log('Loaded vertex shader.');
            this.vertexShader = glsl;
            this.init();
        });

        this.loadShader(this.shaderBurningShipJulia, (glsl) => {
            console.log('Loaded fragment shader.');
            this.fragmentShader = glsl;
            this.init();
        });
        
    }

    isLoaded(): boolean {

        return this.vertexShader.length > 0
            && this.fragmentShader.length > 0;

    }

    init(): void {

        if(!this.isLoaded()) {
            console.log('Init called but not ready.');
            return;
        }

        console.log('Creating renderer...');
        this.createRenderer();

        console.log('Creating scene...');
        this.createScene();

        console.log('Starting...');
        this.start();

    }

}

var app = new App();