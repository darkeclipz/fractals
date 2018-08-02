var FractalViewer = /** @class */ (function () {
    function FractalViewer(canvasId, vueId) {
        this.canvasId = canvasId;
        this.vueId = vueId;
        console.log('Rendering to canvas', this.canvasId);
        this.initVue();
        this.initThree();
    }
    FractalViewer.prototype.initVue = function () {
        this.vue = new Vue({
            el: '#' + this.vueId,
            data: {
                message: 'Hello Vue!'
            }
        });
        console.log('Vue initialized!');
    };
    FractalViewer.prototype.initThree = function () {
        var _this = this;
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
        window.addEventListener('resize', function () { return _this.onWindowResize; }, false);
        console.log('Three initialized!');
    };
    FractalViewer.prototype.render = function () {
        this.uniforms.u_time.value += 0.05;
        this.vue.message = 'T: ' + this.uniforms.u_time.value;
        this.renderer.render(this.scene, this.camera);
    };
    FractalViewer.prototype.onWindowResize = function (event) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    };
    return FractalViewer;
}());
