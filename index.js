import * as THREE from './node_modules/three/src/Three.js';

let scene, camera, renderer; // Threejs
let ctx, audio, audioSrc, analyser, fqdata; // Audio

// Audio
ctx = new AudioContext();
audio = document.querySelector('#track');
audioSrc = ctx.createMediaElementSource(audio);
analyser = ctx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
fqdata = new Uint8Array(analyser.frequencyBinCount);


// Scene
scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xE5E5E5, 0.001);
scene.background = new THREE.Color(0xE5E5E5);

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 1020;
camera.position.y = 200;

// Renderer
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Ground Mesh
var groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 32, 32);
var groundMaterial = new THREE.MeshStandardMaterial({color: 0x30424d});
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    camera.lookAt(ground.position);

    analyser.getByteFrequencyData(fqdata);
}

render();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);