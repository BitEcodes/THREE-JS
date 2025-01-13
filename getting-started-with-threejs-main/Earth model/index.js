// Import necessary modules from the Three.js library
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js";

// Function to create a star field with randomly positioned stars
function createStarField(numStars) {
    const starsGeometry = new THREE.BufferGeometry(); // Create geometry to hold the star positions
    const positions = new Float32Array(numStars * 3); // Array to store 3D positions for each star (x, y, z)
    
    for (let i = 0; i < numStars; i++) {
        // Randomly position each star in a 3D space
        positions[i * 3] = (Math.random() - 0.5) * 2000; // X position, spread out in a 3D space
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // Y position
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // Z position
    }
    
    // Set the positions of the stars in the geometry
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create a material for the stars (white color)
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    
    // Return a Points object, which is a collection of points (stars) with geometry and material
    return new THREE.Points(starsGeometry, starsMaterial);
}

// Set up the scene dimensions and renderer
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene(); // Create a new Three.js scene
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000); // Set up the camera (field of view, aspect ratio, near and far planes)
camera.position.z = 5;  // Move the camera back a bit to view the objects
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Set up the WebGL renderer with antialiasing
renderer.setSize(w, h); // Set the size of the rendering canvas to the window's dimensions
document.body.appendChild(renderer.domElement); // Append the renderer's canvas to the DOM

// Create a group to hold the Earth and rotate it
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Set the rotation of the Earth (in degrees, converted to radians)
scene.add(earthGroup); // Add the group to the scene

// Icosahedron geometry (a spherical shape) and material for the Earth
const geo = new THREE.IcosahedronGeometry(1, 12); // Create the geometry for the Earth (a detailed sphere)
const mat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("8k_earth_daymap.jpg") // Load the Earth texture (make sure the path is correct)
});
const earthMesh = new THREE.Mesh(geo, mat); // Create the mesh using the geometry and material
earthGroup.add(earthMesh); // Add the Earth mesh to the group

// Create and add a star field to the scene
const stars = createStarField(2000); // Call the function to create 2000 stars
scene.add(stars); // Add the stars to the scene

// Add lighting to the scene (Hemisphere light, simulating sunlight)
//const hemiLight = new THREE.HemisphereLight(0x99ffff, 0xaa55aa, 1.0); // Create a light with two colors (sky and ground colors)
//scene.add(hemiLight); // Add the light to the scene



const sunLight =new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2,0.5,1.5)
scene.add(sunLight)

// Set up orbit controls to allow camera rotation with the mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (smooth camera movement)
controls.dampingFactor = 0.03; // Set the damping factor for camera rotation

// Animation loop to continuously update the scene
function animate() {
    requestAnimationFrame(animate); // Request the next frame for animation

    // Rotate the Earth mesh slowly around the y-axis
    earthMesh.rotation.y += 0.002; // Adjust the speed of Earth's rotation

    // Update the controls to handle user input (mouse movement)
    controls.update();

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
