import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Ground Mesh
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Player
const playerBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Sphere(1)
});
playerBody.position.set(0, 5, 0);
world.addBody(playerBody);

const playerGeo = new THREE.SphereGeometry(1, 32, 32);
const playerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const playerMesh = new THREE.Mesh(playerGeo, playerMat);
scene.add(playerMesh);

// Controls
let keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Basic movement
  if (keys['ArrowLeft']) playerBody.velocity.x = -5;
  if (keys['ArrowRight']) playerBody.velocity.x = 5;
  if (keys['ArrowUp']) playerBody.velocity.z = -5;
  if (keys['ArrowDown']) playerBody.velocity.z = 5;
  if (keys['Space'] && Math.abs(playerBody.velocity.y) < 0.05) {
    playerBody.velocity.y = 7;
  }

  world.step(1/60);

  playerMesh.position.copy(playerBody.position);
  camera.lookAt(playerMesh.position);

  renderer.render(scene, camera);
}

animate();
