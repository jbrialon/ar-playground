import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: "/targets/targets2.mind",
  // imageTargetSrc:
  //   "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.2/examples/image-tracking/assets/card-example/card.mind",
});

const { renderer, scene, camera } = mindarThree;

const anchor = mindarThree.addAnchor(0);

/**
 * Model
 */
let mixer, planeAction, propellerAction;
gltfLoader.load("models/airplane/airplane-2.glb", (gltf) => {
  const airplane = gltf.scene;

  mixer = new THREE.AnimationMixer(airplane);
  const animations = gltf.animations;

  planeAction = mixer.clipAction(animations[0]);
  propellerAction = mixer.clipAction(animations[1]);

  // planeAction.play();
  propellerAction.play();
  airplane.position.y = -2;
  airplane.scale.x = 0.3;
  airplane.scale.y = 0.3;
  airplane.scale.z = 0.3;

  anchor.group.add(airplane);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const start = async () => {
  await mindarThree.start();
  tick();
};

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animation
  mixer.update(elapsedTime);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  console.log("start");
  start();
});

stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
});
