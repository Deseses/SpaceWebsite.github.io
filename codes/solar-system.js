/**
 * @module solar-system
 * @description Модуль для создания интерактивной 3D модели Солнечной системы
 * Включает Солнце, 8 планет с орбитами, пояс астероидов и Облако Оорта
 * Использует Three.js для рендеринга и OrbitControls для управления камерой
 */

/**
 * Сцена Three.js
 * @constant {THREE.Scene}
 */
const scene = new THREE.Scene();

/**
 * Камера для просмотра Солнечной системы
 * @constant {THREE.PerspectiveCamera}
 * @property {number} fov - 75 градусов
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

/**
 * WebGL рендерер
 * @constant {THREE.WebGLRenderer}
 * @property {boolean} antialias - Включено сглаживание
 */
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * Орбитальные контроллы для управления камерой
 * @constant {OrbitControls}
 * @property {boolean} enableDamping - Включена инерция
 * @property {number} dampingFactor - Фактор инерции (0.05)
 */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

camera.position.set(0, 30, 80);
controls.update();

/**
 * Фоновое освещение сцены
 * @constant {THREE.AmbientLight}
 */
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

/**
 * Загрузчик текстур
 * @constant {THREE.TextureLoader}
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Модель Солнца
 * @constant {THREE.Mesh}
 */
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

/**
 * Источник света от Солнца
 * @constant {THREE.PointLight}
 * @property {number} intensity - 2
 */
const sunLight = new THREE.PointLight(0xffd700, 2, 300);
scene.add(sunLight);

/**
 * Свечение Солнца (полупрозрачная сфера)
 * @constant {THREE.Mesh}
 */
const sunGlowGeometry = new THREE.SphereGeometry(5.5, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4500,
    transparent: true,
    opacity: 0.3
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

/**
 * Массив данных о планетах
 * @constant {Array<Object>} planets
 * @property {string} name - Название планеты
 * @property {number} radius - Радиус в условных единицах
 * @property {number} distance - Расстояние от Солнца
 * @property {number} speed - Скорость вращения по орбите
 * @property {number} color - Цвет в hex-формате
 */
const planets = [
    { name: "Меркурий", radius: 0.4, distance: 7, speed: 0.04, color: 0x8C7853 },
    { name: "Венера", radius: 0.9, distance: 11, speed: 0.015, color: 0xE6CDB1 },
    { name: "Земля", radius: 1, distance: 15, speed: 0.01, color: 0x6B93D6 },
    { name: "Марс", radius: 0.5, distance: 20, speed: 0.008, color: 0x993D00 },
    { name: "Юпитер", radius: 2, distance: 30, speed: 0.002, color: 0xC9A76C },
    { name: "Сатурн", radius: 1.7, distance: 40, speed: 0.0009, color: 0xE3CFA9 },
    { name: "Уран", radius: 1.2, distance: 50, speed: 0.0004, color: 0xB8D9E9 },
    { name: "Нептун", radius: 1.2, distance: 55, speed: 0.0001, color: 0x3E66F9 }
];

/**
 * Массив мешей планет с их параметрами орбит
 * @type {Array<Object>}
 */
const planetMeshes = [];

/**
 * Создает планеты и их орбиты
 * @function createPlanets
 * @description Для каждой планеты создает:
 *              - Сферический меш планеты
 *              - Кольцевую орбиту
 *              - Сохраняет параметры движения
 */
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    mesh.position.x = planet.distance;
    scene.add(mesh);
    
    planetMeshes.push({
        mesh: mesh,
        distance: planet.distance,
        speed: planet.speed,
        angle: Math.random() * Math.PI * 2
    });
});

/**
 * Кольца Сатурна
 * @constant {THREE.Mesh}
 */
const saturnRingGeometry = new THREE.RingGeometry(2.2, 3.5, 32);
const saturnRingMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xE3CFA9, 
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
planetMeshes[5].mesh.add(saturnRing);

/**
 * Создает круглую текстуру для спрайтов
 * @function createCircleTexture
 * @param {string} color - Цвет в hex или rgba формате
 * @param {number} [size=64] - Размер текстуры в пикселях
 * @returns {THREE.CanvasTexture} Текстура с круглым градиентом
 */
function createCircleTexture(color, size = 64) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    const gradient = context.createRadialGradient(
        size/2, size/2, 0,
        size/2, size/2, size/2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    context.fill();
    
    return new THREE.CanvasTexture(canvas);
}

/**
 * Текстуры для астероидов разных цветов
 * @constant {Array<THREE.CanvasTexture>}
 */
const asteroidTextures = [
    createCircleTexture('#8C7853'),
    createCircleTexture('#A0522D'),
    createCircleTexture('#696969'),
    createCircleTexture('#8B4513')
];

/**
 * Пояс астероидов между Марсом и Юпитером
 * @type {Array<Object>}
 */
const asteroidSprites = [];
const asteroidCount = 300;

for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 22 + Math.random() * 5;
    const height = (Math.random() - 0.5) * 2;
    
    const spriteMaterial = new THREE.SpriteMaterial({
        map: asteroidTextures[Math.floor(Math.random() * asteroidTextures.length)],
        transparent: true,
        opacity: 0.8 + Math.random() * 0.2
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
    );
    
    const size = 0.3 + Math.random() * 0.4;
    sprite.scale.set(size, size, 1);
    
    scene.add(sprite);
    asteroidSprites.push({
        sprite: sprite,
        distance: distance,
        height: height,
        angle: angle,
        speed: 0.0005 + Math.random() * 0.001
    });
}

/**
 * Текстуры для объектов Облака Оорта
 * @constant {Array<THREE.CanvasTexture>}
 */
const oortTextures = [
    createCircleTexture('#87CEEB'),
    createCircleTexture('#B0E0E6'),
    createCircleTexture('#E0FFFF'),
    createCircleTexture('#AFEEEE'),
    createCircleTexture('#ADD8E6')
];

/**
 * Облако Оорта (боковое) - скопление ледяных объектов на границе системы
 * @type {Array<THREE.Points>}
 */
const oortGroups = [];
const objectsPerGroup = 1000;
const oortCloudCount = 30000;

for (let group = 0; group < oortCloudCount / objectsPerGroup; group++) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(objectsPerGroup * 3);
    const colors = new Float32Array(objectsPerGroup * 3);
    
    for (let i = 0; i < objectsPerGroup; i++) {
        const index = group * objectsPerGroup + i;
        if (index >= oortCloudCount) break;
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI / 2;
        const radius = 80 + Math.random() * 120;
        
        const posIndex = i * 3;
        positions[posIndex] = radius * Math.cos(phi);
        positions[posIndex + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[posIndex + 2] = radius * Math.sin(phi) * Math.cos(theta);
        
        colors[posIndex] = 0.5 + Math.random() * 0.3;
        colors[posIndex + 1] = 0.6 + Math.random() * 0.3;
        colors[posIndex + 2] = 0.8 + Math.random() * 0.2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.3 + Math.random() * 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.3,
        map: oortTextures[Math.floor(Math.random() * oortTextures.length)]
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    oortGroups.push(points);
}

/**
 * Внешний слой Облака Оорта для большей глубины
 * @constant {THREE.Points}
 */
const outerOortCount = 10000;
const outerOortGeometry = new THREE.BufferGeometry();
const outerPositions = new Float32Array(outerOortCount * 3);
const outerColors = new Float32Array(outerOortCount * 3);

for (let i = 0; i < outerOortCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI / 2;
    const radius = 150 + Math.random() * 200;
    
    outerPositions[i * 3] = radius * Math.cos(phi);
    outerPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    outerPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.cos(theta);
    
    outerColors[i * 3] = 0.4 + Math.random() * 0.3;
    outerColors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
    outerColors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
}

outerOortGeometry.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
outerOortGeometry.setAttribute('color', new THREE.BufferAttribute(outerColors, 3));

const outerOortMaterial = new THREE.PointsMaterial({
    size: 0.2 + Math.random() * 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.3 + Math.random() * 0.2,
    map: oortTextures[Math.floor(Math.random() * oortTextures.length)]
});

const outerOortCloud = new THREE.Points(outerOortGeometry, outerOortMaterial);
scene.add(outerOortCloud);
oortGroups.push(outerOortCloud);

/**
 * Звездное небо (фон)
 * @type {Array<THREE.Sprite>}
 */
const starSprites = [];
const starCount = 5000;
const starTextures = [
    createCircleTexture('#FFFFFF'),
    createCircleTexture('#FFFAF0'),
    createCircleTexture('#F0F8FF'),
    createCircleTexture('#FFF8DC'),
    createCircleTexture('#FFE4E1')
];

for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    
    const spriteMaterial = new THREE.SpriteMaterial({
        map: starTextures[Math.floor(Math.random() * starTextures.length)],
        transparent: true,
        opacity: 0.7 + Math.random() * 0.3
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    
    const size = 0.8 + Math.random() * 1.2;
    sprite.scale.set(size, size, 1);
    
    scene.add(sprite);
    starSprites.push(sprite);
}

/**
 * Анимационный цикл
 * @function animate
 * @description Обновляет:
 *              - Вращение Солнца и его свечения
 *              - Положения планет на орбитах
 *              - Положения астероидов
 *              - Вращение Облака Оорта
 */
function animate() {
    requestAnimationFrame(animate);
    
    sun.rotation.y += 0.001;
    sunGlow.rotation.y += 0.0005;
    
    planetMeshes.forEach(planet => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.rotation.y += 0.01;
    });
    
    asteroidSprites.forEach(asteroid => {
        asteroid.angle += asteroid.speed;
        asteroid.sprite.position.x = Math.cos(asteroid.angle) * asteroid.distance;
        asteroid.sprite.position.z = Math.sin(asteroid.angle) * asteroid.distance;
        asteroid.sprite.position.y = asteroid.height + Math.sin(asteroid.angle * 3) * 0.5;
    });
    
    oortGroups.forEach(group => {
        group.rotation.y += 0.00001;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

/**
 * Обработчик изменения размера окна
 * @function onWindowResize
 * @description Адаптирует камеру и рендерер под новый размер окна
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

animate();
