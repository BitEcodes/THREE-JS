import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";

// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create geometry and material for the cube
const geometry = new THREE.BoxGeometry(1, 1, 1); // Corrected "BoxGeomwtry"
const material = new THREE.MeshBasicMaterial({ color: "red" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"), // Ensure an HTML canvas element with id="canvas" exists
  antialias: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.setSize(window.innerWidth, window.innerHeight);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.01; // Rotate the cube
  renderer.render(scene, camera);
}

animate();
