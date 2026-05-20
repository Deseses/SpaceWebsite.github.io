/**
 * @module 3dasteroid
 * @description Модуль для отображения 3D модели астероида с использованием Three.js
 * Создает интерактивную 3D сцену с вращающейся моделью астероида,
 * поддерживает управление камерой через OrbitControls
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Сцена Three.js для размещения всех 3D объектов
 * @constant {THREE.Scene}
 */
const scene = new THREE.Scene();

/**
 * Камера для просмотра 3D сцены
 * @constant {THREE.PerspectiveCamera}
 * @property {number} fov - Угол обзора (75 градусов)
 * @property {number} aspect - Соотношение сторон окна
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/**
 * Загруженная 3D модель астероида
 * @type {THREE.Group|null}
 */
let object;

/**
 * Контроллер для управления камерой (вращение, масштабирование)
 * @type {OrbitControls|null}
 */
let controls;

/**
 * Имя загружаемой модели (папка в директории models)
 * @constant {string}
 */
let objToRender = 'asteroid';

/**
 * Загрузчик GLTF моделей
 * @constant {GLTFLoader}
 */
const loader = new GLTFLoader();

/**
 * Загружает 3D модель астероида из файла scene.gltf
 * @function loader.load
 * @param {string} - Путь к модели `./models/asteroid/scene.gltf`
 * @param {Function} callback - Функция успешной загрузки
 * @param {Function} progressCallback - Функция отслеживания прогресса
 * @param {Function} errorCallback - Функция обработки ошибки
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
 * @property {boolean} alpha - Включена прозрачность фона
 */
const renderer = new THREE.WebGLRenderer({ alpha: true }); 

/**
 * Контейнер для 3D сцены в DOM
 * @constant {HTMLElement}
 */
const container = document.getElementById("container3D");

// Настройка размера рендерера под контейнер
renderer.setSize(container.clientWidth, container.clientHeight);
camera.aspect = container.clientWidth / container.clientHeight;

// Добавление рендерера в DOM
document.getElementById("container3D").appendChild(renderer.domElement);

/**
 * Направленный источник света сверху
 * @constant {THREE.DirectionalLight}
 * @property {number} intensity - Интенсивность света (5)
 * @property {boolean} castShadow - Включено отбрасывание теней
 */
const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

/**
 * Фоновое равномерное освещение сцены
 * @constant {THREE.AmbientLight}
 * @property {number} intensity - Интенсивность света (1)
 */
const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Инициализация контроллов камеры
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * Настраивает камеру для оптимального просмотра модели
 * @function setupUniversalCamera
 * @param {THREE.Group} model - Загруженная 3D модель
 * @description Вычисляет bounding box модели и позиционирует камеру,
 *              чтобы модель полностью помещалась в поле зрения
 */
function setupUniversalCamera(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2));
  
  camera.position.z = cameraDistance * 0.6;
  camera.lookAt(center);
  
  controls.target.copy(center);
  controls.update();
}

/**
 * Анимационный цикл рендеринга
 * @function animate
 * @description Постоянно обновляет сцену:
 *              - Вращает модель астероида
 *              - Обновляет контроллы камеры
 *              - Перерисовывает сцену
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
 * @function window.addEventListener
 * @description Адаптирует размеры рендерера и пропорции камеры
 *              при изменении размера окна браузера
 */
window.addEventListener("resize", function () {
  const container = document.getElementById("container3D");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  controls.update();
});

// Запуск анимации
animate();