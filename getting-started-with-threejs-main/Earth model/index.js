import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js";

// Ensure you have a function to create a star field or use a simple method to create stars
function createStarField(numStars) {
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numStars * 3);
    
    for (let i = 0; i < numStars; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000; // X
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // Y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // Z
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    return new THREE.Points(starsGeometry, starsMaterial);
}

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;  // Set camera position to view the object
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Earth Group
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Corrected to degrees
scene.add(earthGroup);

// Icosahedron geometry and material (Earth)
const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("8k_earth_daymap.jpg") // Ensure this path is correct
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

// Create and add stars
const stars = createStarField(2000);
scene.add(stars);

// Light  
const hemiLight = new THREE.HemisphereLight(0x99ffff, 0xaa55aa, 1.0);
scene.add(hemiLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    // Rotation of the Earth mesh
    earthMesh.rotation.y += 0.002;

    // Update controls (for orbiting with mouse)
    controls.update();

    renderer.render(scene, camera);
}

animate();