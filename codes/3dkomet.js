/**
 * @module 3dkomet
 * @description Модуль для отображения 3D модели кометы с использованием Three.js
 * Аналогичен модулю астероида, но использует другую модель (iceblock)
 * и имеет другие настройки камеры
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Сцена Three.js
 * @constant {THREE.Scene}
 */
const scene = new THREE.Scene();

/**
 * Камера для просмотра 3D модели кометы
 * @constant {THREE.PerspectiveCamera}
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/**
 * Загруженная 3D модель кометы
 * @type {THREE.Group|null}
 */
let object;

/**
 * Контроллер управления камерой
 * @type {OrbitControls|null}
 */
let controls;

/**
 * Имя папки с моделью кометы
 * @constant {string}
 */
let objToRender = 'iceblock';

/**
 * Загрузчик GLTF моделей
 * @constant {GLTFLoader}
 */
const loader = new GLTFLoader();

/**
 * Загрузка модели кометы из папки ./models/iceblock/
 * @function loader.load
 */
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
    setupUniversalCamera(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

/**
 * WebGL рендерер с прозрачным фоном
 * @constant {THREE.WebGLRenderer}
 */
const renderer = new THREE.WebGLRenderer({ alpha: true }); 

/**
 * DOM контейнер для 3D сцены
 * @constant {HTMLElement}
 */
const container = document.getElementById("container3D");
renderer.setSize(container.clientWidth, container.clientHeight);
camera.aspect = container.clientWidth / container.clientHeight;

document.getElementById("container3D").appendChild(renderer.domElement);

/**
 * Направленный источник света
 * @constant {THREE.DirectionalLight}
 */
const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

/**
 * Фоновое освещение
 * @constant {THREE.AmbientLight}
 */
const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * Настройка камеры для модели кометы
 * @function setupUniversalCamera
 * @param {THREE.Group} model - 3D модель кометы
 * @description Расстояние до камеры меньше (0.5), чем для астероида (0.6)
 */
function setupUniversalCamera(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2));
  
  camera.position.z = cameraDistance * 0.5;
  camera.lookAt(center);
  
  controls.target.copy(center);
  controls.update();
}

/**
 * Анимационный цикл
 * @function animate
 * @description Вращает модель кометы и обновляет сцену
 */
function animate() {
  requestAnimationFrame(animate);
  if (object) {
    object.rotation.x += 0.02;
    object.rotation.y += 0.01;
  } 
  controls.update();
  renderer.render(scene, camera);
}

/**
 * Обработчик изменения размера окна
 * @function resize
 */
window.addEventListener("resize", function () {
  const container = document.getElementById("container3D");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  controls.update();
});

animate();