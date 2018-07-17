"use strict";
exports.__esModule = true;
var THREE = require("../ThreeJS/bower_components/threejs");
var App = /** @class */ (function () {
    function App() {
        this.shaderVertexPath = "shaders/vertex_Projection.glsl";
        this.shaderBurningShipJulia = "shaders/fragment_BurningShipJulia.glsl";
        this.renderer = new THREE.WebGLRenderer();
        this.init();
    }
    App.prototype.loadShader = function (path, callback) {
        var client = new XMLHttpRequest();
        client.open('GET', path);
        client.onreadystatechange = function () {
            callback(client.responseText);
        };
        client.send();
    };
    App.prototype.createScene = function (glsl) {
    };
    App.prototype.createRenderer = function () {
    };
    App.prototype.init = function () {
        this.loadShader(this.shaderVertexPath, function (glsl) {
            this.vertexShader = glsl;
        });
        alert(1);
    };
    return App;
}());
exports.App = App;
