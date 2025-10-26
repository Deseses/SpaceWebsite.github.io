// Инициализация сцены, камеры и рендерера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Устанавливаем размер рендерера точно по размеру окна
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Добавляем canvas после header
document.body.appendChild(renderer.domElement);

// Добавление контроля камеры
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Настройка камеры
camera.position.set(0, 30, 80);
controls.update();

// Добавление освещения
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Создание небесных тел
const textureLoader = new THREE.TextureLoader();

// Солнце с собственным свечением
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Свет от Солнца
const sunLight = new THREE.PointLight(0xffd700, 2, 300);
scene.add(sunLight);

// Свечение Солнца
const sunGlowGeometry = new THREE.SphereGeometry(5.5, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4500,
    transparent: true,
    opacity: 0.3
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// Планеты с их орбитами
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

const planetMeshes = [];

planets.forEach(planet => {
    // Создание планеты
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Создание орбиты
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
    
    // Начальная позиция планеты
    mesh.position.x = planet.distance;
    scene.add(mesh);
    
    planetMeshes.push({
        mesh: mesh,
        distance: planet.distance,
        speed: planet.speed,
        angle: Math.random() * Math.PI * 2
    });
});

// Кольца Сатурна
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

// Создание круглой текстуры для спрайтов
function createCircleTexture(color, size = 64) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Градиент для круглой формы
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

// Главный пояс астероидов с круглыми спрайтами
const asteroidCount = 300;
const asteroidSprites = [];

// Текстуры для астероидов разных цветов
const asteroidTextures = [
    createCircleTexture('#8C7853'), // коричневый
    createCircleTexture('#A0522D'), // землистый
    createCircleTexture('#696969'), // серый
    createCircleTexture('#8B4513')  // коричневый
];

for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 22 + Math.random() * 5; // Между Марсом и Юпитером
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
    
    // Разный размер астероидов
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

// Облако Оорта - повернуто на 90 градусов (сбоку)
const oortCloudCount = 30000;
const oortCloudSprites = [];

// Текстуры для комет Облака Оорта
const oortTextures = [
    createCircleTexture('#87CEEB'), // голубой
    createCircleTexture('#B0E0E6'), // пудрово-голубой
    createCircleTexture('#E0FFFF'), // светло-голубой
    createCircleTexture('#AFEEEE'), // бирюзовый
    createCircleTexture('#ADD8E6')  // светло-голубой
];

console.log("Создание бокового Облака Оорта...");

// Создаем группы объектов для оптимизации
const oortGroups = [];
const objectsPerGroup = 1000;

for (let group = 0; group < oortCloudCount / objectsPerGroup; group++) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(objectsPerGroup * 3);
    const colors = new Float32Array(objectsPerGroup * 3);
    
    for (let i = 0; i < objectsPerGroup; i++) {
        const index = group * objectsPerGroup + i;
        if (index >= oortCloudCount) break;
        
        // Полусферическое распределение повернутое на 90 градусов (сбоку)
        // Теперь полусфера направлена вдоль оси X (вправо)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI / 2; // Только половина сферы
        const radius = 80 + Math.random() * 120;
        
        const posIndex = i * 3;
        // Поворот на 90 градусов: меняем оси Y и X
        positions[posIndex] = radius * Math.cos(phi);       // X - основное направление полусферы
        positions[posIndex + 1] = radius * Math.sin(phi) * Math.sin(theta); // Y
        positions[posIndex + 2] = radius * Math.sin(phi) * Math.cos(theta); // Z
        
        // Случайный голубой цвет
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

// Дополнительный внешний слой для большей глубины
const outerOortCount = 10000;
const outerOortGeometry = new THREE.BufferGeometry();
const outerPositions = new Float32Array(outerOortCount * 3);
const outerColors = new Float32Array(outerOortCount * 3);

for (let i = 0; i < outerOortCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI / 2;
    const radius = 150 + Math.random() * 200;
    
    // Поворот на 90 градусов для внешнего слоя
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

console.log("Боковое Облака Оорта создано: " + (oortCloudCount + outerOortCount) + " объектов");

// Звездное небо с круглыми звездами
const starCount = 5000;
const starSprites = [];

// Текстуры для звезд разных цветов
const starTextures = [
    createCircleTexture('#FFFFFF'), // белый
    createCircleTexture('#FFFAF0'), // бежевый
    createCircleTexture('#F0F8FF'), // голубоватый
    createCircleTexture('#FFF8DC'), // кремовый
    createCircleTexture('#FFE4E1')  // розоватый
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
    
    // Разный размер звезд
    const size = 0.8 + Math.random() * 1.2;
    sprite.scale.set(size, size, 1);
    
    scene.add(sprite);
    starSprites.push(sprite);
}

// Анимация
function animate() {
    requestAnimationFrame(animate);
    
    // Вращение Солнца и его свечения
    sun.rotation.y += 0.001;
    sunGlow.rotation.y += 0.0005;
    
    // Движение планет по орбитам
    planetMeshes.forEach(planet => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.rotation.y += 0.01;
    });
    
    // Движение астероидов
    asteroidSprites.forEach(asteroid => {
        asteroid.angle += asteroid.speed;
        asteroid.sprite.position.x = Math.cos(asteroid.angle) * asteroid.distance;
        asteroid.sprite.position.z = Math.sin(asteroid.angle) * asteroid.distance;
        
        // Легкое колебание по высоте
        asteroid.sprite.position.y = asteroid.height + Math.sin(asteroid.angle * 3) * 0.5;
    });
    
    // Медленное вращение Облака Оорта вокруг оси Y
    oortGroups.forEach(group => {
        group.rotation.y += 0.00001;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// Обработка изменения размера окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

animate();