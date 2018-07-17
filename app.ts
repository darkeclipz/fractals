import * as THREE from '../ThreeJS/bower_components/threejs';

export class App {

    shaderVertexPath: string = "shaders/vertex_Projection.glsl";
    shaderBurningShipJulia: string = "shaders/fragment_BurningShipJulia.glsl";

    vertexShader: string;
    fragmentShader: string;

    renderer = new THREE.WebGLRenderer();

    constructor() {
        this.init();
    }

    loadShader(path: string, callback: Function): void {

        var client = new XMLHttpRequest();
        client.open('GET', path);

        client.onreadystatechange = function() {
            callback(client.responseText);
        }

        client.send();

    }

    createScene(glsl: string): void {


    }

    createRenderer(): void {


    }

    init(): void {

        this.loadShader(this.shaderVertexPath, function(glsl) {
            this.vertexShader = glsl;
        });

        alert(1);
    }

}