import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const envelopeMeshes = [];
const loader = new THREE.TextureLoader();

// Add ambient light to brighten the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light with full intensity
scene.add(ambientLight);

// Adjusted aspect ratio for envelope images
const envelopeWidth = 2; // Adjusted width
const envelopeHeight = (130 / 213) * envelopeWidth; // Maintain aspect ratio

// Ensure textures are loaded before rendering
for (let i = 1; i <= 8; i++) {
  loader.load(
    `/images/envelope-${i}.png`,
    (texture) => {
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const geometry = new THREE.PlaneGeometry(envelopeWidth, envelopeHeight); // Updated geometry dimensions
      const mesh = new THREE.Mesh(geometry, material);
      envelopeMeshes.push(mesh);
      scene.add(mesh);

      // Position envelopes in an oval
      const angle = (envelopeMeshes.length / 9) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * ovalRadiusX, 0, Math.sin(angle) * ovalRadiusZ);
    },
    undefined,
    (error) => {
      console.error(`Failed to load texture /images/envelope-${i}.png`, error);
    }
  );
}

const ovalRadiusX = 4;
const ovalRadiusZ = 2.5;

camera.position.z = 5;

function animate() {
  const time = Date.now() * 0.001; // Time in seconds

  envelopeMeshes.forEach((mesh, index) => {
    const angle = (index / envelopeMeshes.length) * Math.PI * 2 + time * 0.3; // Adjust speed with time
    mesh.position.set(-Math.cos(angle) * ovalRadiusX, Math.sin(angle) * ovalRadiusZ, 0);
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);