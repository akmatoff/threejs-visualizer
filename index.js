import * as THREE from './node_modules/three/src/Three.js';

let scene, camera, renderer, ambientLight; // Threejs
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
scene.fog = new THREE.FogExp2(0x111111, 0.025);
scene.background = new THREE.Color(0x1111111);

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 55;
camera.position.y = 50;

// Renderer
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Light
ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

// Geometries, materials and mesh
var triangleGeometry = new THREE.Geometry();
triangleGeometry.vertices.push(new THREE.Vector3(1, 2, 0));
triangleGeometry.vertices.push(new THREE.Vector3(3, 1, 0));
triangleGeometry.vertices.push(new THREE.Vector3(3, 3, 0));
triangleGeometry.faces.push(
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(1, 1, 0)
);
var triangleMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFEE});
var triangles = [];
var triangleGroup = new THREE.Group();

for (let i = 0; i <= 1000; i++) {
    var triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangle.position.x = Math.random() * 50 - 20;
    triangle.position.y = Math.random() * 60 - 5;
    triangle.position.z = Math.random() * 80 - 5;
    triangle.rotation.y = Math.random() * 5;
    triangle.rotation.x = Math.random() * 5;
    triangles.push(triangle);
    triangleGroup.add(triangle);
}

scene.add(triangleGroup);
triangleGroup.position.y = -5;

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    for (let fq = 0; fq < 256; fq++) {
        triangles.forEach((triangle) => {
            triangle.position.y -= fqdata[15] * 0.001 / 1000;
            triangle.position.y += fqdata[10] * 0.001 / 1000;
            triangle.rotation.x += fqdata[250] * 0.0001 / 10;
            triangle.rotation.x -= fqdata[100] * 0.0001 / 10;
            triangleMaterial.color = new THREE.Color(0xFFFFEE + ( fqdata[106] * 0.01 / 100) * 0xE5E500);
        });
    }

    camera.position.z = 55 + fqdata[200] * 0.001;

    camera.lookAt(scene.position);

    analyser.getByteFrequencyData(fqdata);
}

render();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);