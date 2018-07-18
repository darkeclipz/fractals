import * as THREE from 'three';

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

        // this.loadShader(this.shaderVertexPath, function(glsl) {
        //     this.vertexShader = glsl;
        // });


          //https://stackoverflow.com/questions/24820004/how-to-implement-a-shadertoy-shader-in-three-js
          let scene = new THREE.Scene();
          let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

          let renderer = new THREE.WebGLRenderer();
          renderer.setSize( window.innerWidth, window.innerHeight );
          document.body.appendChild( renderer.domElement );
          
          let tuniform = {
              iTime:    { type: 'f', value: 0.1 },
              iResolution: { type: 'vec2', value: { x: window.innerWidth, y: window.innerHeight } }
          };

          var material = new THREE.ShaderMaterial({
              uniforms: tuniform,
              vertexShader: document.getElementById('vertexShader').textContent,
              fragmentShader: document.getElementById('fragmentShader').textContent,            
              side:THREE.DoubleSide
          });

          var tobject = new THREE.Mesh( new THREE.PlaneGeometry(700, 394,1,1), material);

          camera.position.z = 200;
          scene.add(tobject);

          let clock = +new Date();

          var render = function () {
              requestAnimationFrame(render);
              renderer.render(scene, camera);

              let current = +new Date();
              let timePassed = (current - clock)/1000;
              clock = current;
              tuniform.iTime.value += timePassed;
          };

          //render();
          renderer.render(scene, camera);
    }

}

var app = new App();