import RoboBase from './js/robo-base.js';

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 400;

var scene = new THREE.Scene();

var roboBase = new RoboBase(scene);
roboBase.renderMenu();
roboBase.render();

setInterval(function() {
	renderer.render(scene, camera);
}, 100);
