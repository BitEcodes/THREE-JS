// Importing necessary libraries from the CDN
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js";

// Setting up the scene and renderer
const w = window.innerWidth; // Getting the window width
const h = window.innerHeight; // Getting the window height
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Creating the WebGL renderer with antialiasing for smoother edges
renderer.setSize(w, h); // Setting the renderer size to match the window dimensions
document.body.appendChild(renderer.domElement); // Adding the renderer's canvas to the DOM

// Setting up the camera with perspective projection
const fov = 75; // Field of view in degrees
const aspect = w / h; // Aspect ratio of the window
const near = 0.1; // Near clipping plane
const far = 10; // Far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // Creating the camera
camera.position.z = 2; // Positioning the camera along the Z-axis

// Creating the scene
const scene = new THREE.Scene();

// Adding OrbitControls to allow mouse interaction with the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enabling smooth camera movement
controls.dampingFactor = 0.03; // Damping factor to control smoothness

// Creating a geometric shape (Icosahedron) and material
const geo = new THREE.IcosahedronGeometry(1.0, 2); // 3D geometry for an icosahedron (20-faced polyhedron)
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffdf, // Material color
  flatShading: true, // Using flat shading for the mesh
});
const mesh = new THREE.Mesh(geo, mat); // Creating the mesh with the geometry and material
scene.add(mesh); // Adding the mesh to the scene

// Creating a wireframe mesh around the icosahedron
const wireMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color(92 / 255, 74 / 255, 255 / 255), // Wireframe color (light blue)
  wireframe: true, // Enabling wireframe mode
});
const wireMesh = new THREE.Mesh(geo, wireMat); // Creating the wireframe mesh
wireMesh.scale.setScalar(1.001); // Scaling it slightly bigger to make it a wireframe around the solid mesh
mesh.add(wireMesh); // Adding the wireframe mesh to the icosahedron

// Adding a hemisphere light to the scene (for ambient lighting)
//const hemiLight = new THREE.HemisphereLight(0x99ffff, 0xaa55aa, 1.0); // Light color and intensity
//scene.add(hemiLight); // Adding the light to the scene


// The animate function that runs the rendering loop
function animate() {
  requestAnimationFrame(animate); // Requesting the next frame of animation
  controls.update(); // Updating the OrbitControls (for smooth camera movement)
  renderer.render(scene, camera); // Rendering the scene with the camera
}

// Calling the animate function to start the loop
animate();
