import * as THREE from "three"; 
// Import the entire THREE.js library for 3D rendering and object creation.

import { OrbitControls } from 'jsm/controls/OrbitControls.js';
// Import the OrbitControls for mouse interaction with the camera.

import spline from "./spline.js";
// Import a custom spline geometry (assumed to be defined in "spline.js").

import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
// Import the EffectComposer for post-processing effects.

import { RenderPass } from "jsm/postprocessing/RenderPass.js";
// Import RenderPass, which renders the scene as a texture for post-processing.

import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";
// Import UnrealBloomPass, which adds a bloom effect for bright areas.

const w = window.innerWidth;
const h = window.innerHeight;
// Store the window's width and height for the renderer.

const scene = new THREE.Scene();
// Create a new THREE.js scene.

scene.fog = new THREE.FogExp2(0x000000, 0.3);
// Add exponential fog to the scene with black color and a density of 0.3.

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
// Create a perspective camera with a 75-degree FOV, aspect ratio, and near/far clipping planes.

camera.position.z = 5;
// Set the camera's initial position along the Z-axis.

const renderer = new THREE.WebGLRenderer();
// Create a WebGL renderer for rendering the scene.

renderer.setSize(w, h);
// Set the renderer's size to match the window dimensions.

renderer.toneMapping = THREE.ACESFilmicToneMapping;
// Use ACES Filmic Tone Mapping for better color contrast.

renderer.outputColorSpace = THREE.SRGBColorSpace;
// Use sRGB color space for output to ensure accurate color rendering.

document.body.appendChild(renderer.domElement);
// Append the renderer's canvas element to the document body.

const controls = new OrbitControls(camera, renderer.domElement);
// Create OrbitControls for camera interaction using the mouse.

controls.enableDamping = true;
// Enable smooth camera damping.

controls.dampingFactor = 0.03;
// Set the damping factor for the camera's motion.

const renderScene = new RenderPass(scene, camera);
// Create a RenderPass to render the scene for post-processing.

const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
// Create an UnrealBloomPass for bloom effects with specified resolution, strength, radius, and threshold.

bloomPass.threshold = 0.002;
// Set the bloom threshold to define the intensity for bright areas.

bloomPass.strength = 3.5;
// Set the strength of the bloom effect.

bloomPass.radius = 0;
// Set the radius of the bloom effect.

const composer = new EffectComposer(renderer);
// Create an EffectComposer to manage post-processing passes.

composer.addPass(renderScene);
// Add the RenderPass to the composer.

composer.addPass(bloomPass);
// Add the UnrealBloomPass to the composer.

const points = spline.getPoints(100);
// Generate 100 points along the spline path.

const geometry = new THREE.BufferGeometry().setFromPoints(points);
// Create a BufferGeometry from the points.

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// Create a basic line material with a red color.

const line = new THREE.Line(geometry, material);
// Create a line object using the geometry and material.

const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
// Create a TubeGeometry along the spline with specified segments, radius, and radial segments.

const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
// Generate an edges geometry from the TubeGeometry for wireframe-like appearance.

const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
// Create a line material for the edges with a red color.

const tubeLines = new THREE.LineSegments(edges, lineMat);
// Create a LineSegments object for the tube edges.

scene.add(tubeLines);
// Add the tubeLines object to the scene.

const numBoxes = 55;
// Define the number of boxes to create.

const size = 0.075;
// Set the size for each box.

const boxGeo = new THREE.BoxGeometry(size, size, size);
// Create a box geometry with the specified size.

for (let i = 0; i < numBoxes; i += 1) {
  // Loop to create multiple boxes.

  const boxMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });
  // Create a wireframe material for the boxes.

  const box = new THREE.Mesh(boxGeo, boxMat);
  // Create a box mesh using the geometry and material.

  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  // Calculate a random position along the spline.

  const pos = tubeGeo.parameters.path.getPointAt(p);
  // Get the position on the spline at a given point.

  pos.x += Math.random() - 0.4;
  pos.z += Math.random() - 0.4;
  // Add some randomness to the box's position.

  box.position.copy(pos);
  // Set the box's position.

  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  // Generate a random rotation vector.

  box.rotation.set(rote.x, rote.y, rote.z);
  // Set the box's rotation.

  const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
  // Create edges geometry for the box.

  const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
  // Generate a color based on the position along the spline.

  const lineMat = new THREE.LineBasicMaterial({ color });
  // Create a line material with the generated color.

  const boxLines = new THREE.LineSegments(edges, lineMat);
  // Create a LineSegments object for the box's edges.

  boxLines.position.copy(pos);
  boxLines.rotation.set(rote.x, rote.y, rote.z);
  // Set the position and rotation for the boxLines.

  scene.add(boxLines);
  // Add the boxLines to the scene.
}

function updateCamera(t) {
  const time = t * 0.1;
  // Scale time for smooth animation.

  const looptime = 10 * 1000;
  // Define the loop duration in milliseconds.

  const p = (time % looptime) / looptime;
  // Calculate the camera's position along the spline.

  const pos = tubeGeo.parameters.path.getPointAt(p);
  // Get the camera's position on the spline.

  const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
  // Get the point the camera should look at.

  camera.position.copy(pos);
  camera.lookAt(lookAt);
  // Set the camera's position and orientation.
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  // Request the next animation frame.

  updateCamera(t);
  // Update the camera's position and orientation.

  composer.render(scene, camera);
  // Render the scene with post-processing.

  controls.update();
  // Update the OrbitControls.
}

animate();
// Start the animation loop.

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  // Update the camera's aspect ratio.

  camera.updateProjectionMatrix();
  // Update the projection matrix.

  renderer.setSize(window.innerWidth, window.innerHeight);
  // Adjust the renderer size.
}

window.addEventListener('resize', handleWindowResize, false);
// Add an event listener to handle window resizing.
