/**
 * @module telescope
 * @description Модуль интерактивного телескопа для наблюдения за звездным небом
 * Создает canvas с анимированными звездами, кометами и астероидами,
 * позволяет увеличивать изображение под курсором мыши
 */

/**
 * DOM элементы управления
 * @constant {HTMLCanvasElement} canvas - Холст для рисования звездного неба
 * @constant {CanvasRenderingContext2D} ctx - 2D контекст рисования
 * @constant {HTMLElement} telescope - Элемент "телескоп" (лупа)
 * @constant {HTMLElement} telescopeView - Вьюпорт телескопа
 */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const telescope = document.getElementById('telescope');
const telescopeView = document.getElementById('telescope-view');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomValue = document.getElementById('zoom-value');

/**
 * Массив звезд
 * @type {Array<Object>}
 * @property {number} x - Координата X
 * @property {number} y - Координата Y
 * @property {number} size - Размер звезды
 * @property {number} brightness - Яркость звезды
 * @property {number} twinkleSpeed - Скорость мерцания
 * @property {number} twinkleOffset - Фаза мерцания
 */
let stars = [];

/**
 * Массив комет
 * @type {Array<Object>}
 * @property {number} x - Координата X
 * @property {number} y - Координата Y
 * @property {number} size - Размер кометы
 * @property {number} speedX - Скорость по X
 * @property {number} speedY - Скорость по Y
 * @property {number} tailLength - Длина хвоста
 * @property {string} color - Цвет кометы
 */
let comets = [];

/**
 * Массив астероидов
 * @type {Array<Object>}
 * @property {number} x - Координата X
 * @property {number} y - Координата Y
 * @property {number} size - Размер астероида
 * @property {number} speedX - Скорость по X
 * @property {number} speedY - Скорость по Y
 * @property {number} rotation - Текущий угол поворота
 * @property {number} rotationSpeed - Скорость вращения
 */
let asteroids = [];

/**
 * Позиция курсора мыши
 * @type {number}
 */
let mouseX = 0;
let mouseY = 0;

/**
 * Размер телескопа в пикселях
 * @type {number}
 */
let telescopeSize = 200;

/**
 * Текущий уровень увеличения
 * @type {number}
 */
let zoomLevel = 1;

/**
 * Границы зума
 * @constant {number}
 */
const maxZoom = 8;
const minZoom = 0.5;

/**
 * ID анимационного фрейма
 * @type {number}
 */
let animationId;

/**
 * Инициализирует canvas и создает объекты
 * @function initCanvas
 */
function initCanvas() {
    const container = document.querySelector('.telescope-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    createStars();
    createComets();
    createAsteroids();
    
    animate();
}

/**
 * Создает массив звезд
 * @function createStars
 * @description Генерирует 1500 звезд со случайными параметрами
 */
function createStars() {
    const starCount = 1500;
    stars = [];
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.05 + 0.01,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
}

/**
 * Создает массив комет
 * @function createComets
 * @description Генерирует 6 комет со случайными параметрами движения
 */
function createComets() {
    const cometCount = 6;
    comets = [];
    
    for (let i = 0; i < cometCount; i++) {
        comets.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 6 + 4,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            tailLength: Math.random() * 30 + 20,
            color: `rgba(${150 + Math.random() * 100}, ${200 + Math.random() * 55}, 255, 0.9)`
        });
    }
}

/**
 * Создает массив астероидов
 * @function createAsteroids
 * @description Генерирует 20 астероидов неправильной формы
 */
function createAsteroids() {
    const asteroidCount = 20;
    asteroids = [];
    
    for (let i = 0; i < asteroidCount; i++) {
        asteroids.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 8 + 3,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            color: `rgba(${150 + Math.random() * 50}, ${120 + Math.random() * 50}, ${80 + Math.random() * 50}, 0.9)`
        });
    }
}

/**
 * Отрисовывает звездное небо
 * @function drawStars
 * @param {number} time - Текущее время для анимации мерцания
 * @description Рисует звезды с эффектом мерцания, кометы с хвостами
 *              и астероиды неправильной формы
 */
function drawStars(time) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
        ctx.fill();
    });
    
    comets.forEach(comet => {
        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(
            comet.x - comet.speedX * comet.tailLength,
            comet.y - comet.speedY * comet.tailLength
        );
        ctx.strokeStyle = `rgba(200, 230, 255, 0.7)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
        ctx.fillStyle = comet.color;
        ctx.fill();
    });
    
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        ctx.beginPath();
        ctx.moveTo(0, -asteroid.size);
        ctx.lineTo(asteroid.size * 0.7, -asteroid.size * 0.5);
        ctx.lineTo(asteroid.size, asteroid.size * 0.3);
        ctx.lineTo(asteroid.size * 0.3, asteroid.size);
        ctx.lineTo(-asteroid.size * 0.5, asteroid.size * 0.7);
        ctx.lineTo(-asteroid.size, -asteroid.size * 0.2);
        ctx.closePath();
        
        ctx.fillStyle = asteroid.color;
        ctx.fill();
        ctx.restore();
    });
}

/**
 * Обновляет позиции движущихся объектов
 * @function updatePositions
 * @description Перемещает кометы и астероиды, возвращает их на экран
 *              при выходе за границы
 */
function updatePositions() {
    comets.forEach(comet => {
        comet.x += comet.speedX;
        comet.y += comet.speedY;
        
        if (comet.x < -50) comet.x = canvas.width + 50;
        if (comet.x > canvas.width + 50) comet.x = -50;
        if (comet.y < -50) comet.y = canvas.height + 50;
        if (comet.y > canvas.height + 50) comet.y = -50;
    });
    
    asteroids.forEach(asteroid => {
        asteroid.x += asteroid.speedX;
        asteroid.y += asteroid.speedY;
        asteroid.rotation += asteroid.rotationSpeed;
        
        if (asteroid.x < -30) asteroid.x = canvas.width + 30;
        if (asteroid.x > canvas.width + 30) asteroid.x = -30;
        if (asteroid.y < -30) asteroid.y = canvas.height + 30;
        if (asteroid.y > canvas.height + 30) asteroid.y = -30;
    });
}

/**
 * Анимационный цикл
 * @function animate
 * @param {number} time - Текущее время
 * @description Обновляет позиции, перерисовывает сцену,
 *              обновляет вид телескопа
 */
function animate(time) {
    updatePositions();
    drawStars(time * 0.001);
    animationId = requestAnimationFrame(animate);
    
    if (telescope.style.display === 'block') {
        updateTelescope();
    }
}

/**
 * Обновляет отображение телескопа (лупы)
 * @function updateTelescope
 * @description Позиционирует лупу под курсором и отображает
 *              увеличенную область звездного неба
 */
function updateTelescope() {
    telescope.style.display = 'block';
    telescope.style.left = `${mouseX}px`;
    telescope.style.top = `${mouseY}px`;
    telescope.style.width = `${telescopeSize}px`;
    telescope.style.height = `${telescopeSize}px`;
    
    const viewCanvas = document.createElement('canvas');
    const viewCtx = viewCanvas.getContext('2d');
    viewCanvas.width = telescopeSize;
    viewCanvas.height = telescopeSize;
    
    const zoomAreaSize = telescopeSize / zoomLevel;
    const zoomX = mouseX - zoomAreaSize / 2;
    const zoomY = mouseY - zoomAreaSize / 2;
    
    viewCtx.drawImage(
        canvas, 
        zoomX, zoomY, zoomAreaSize, zoomAreaSize,
        0, 0, telescopeSize, telescopeSize
    );
    
    const gradient = viewCtx.createRadialGradient(
        telescopeSize/2, telescopeSize/2, 0,
        telescopeSize/2, telescopeSize/2, telescopeSize/2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    viewCtx.fillStyle = gradient;
    viewCtx.fillRect(0, 0, telescopeSize, telescopeSize);
    
    telescopeView.innerHTML = '';
    telescopeView.appendChild(viewCanvas);
}

/**
 * Обработчик движения мыши по canvas
 * @event canvas#mousemove
 */
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    updateTelescope();
});

/**
 * Обработчик входа мыши в canvas
 * @event canvas#mouseenter
 */
canvas.addEventListener('mouseenter', () => {
    telescope.style.display = 'block';
    updateTelescope();
});

/**
 * Обработчик выхода мыши из canvas
 * @event canvas#mouseleave
 */
canvas.addEventListener('mouseleave', () => {
    telescope.style.display = 'none';
});

/**
 * Обработчик увеличения зума
 * @event zoomInBtn#click
 */
zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < maxZoom) {
        zoomLevel += 0.5;
        zoomValue.textContent = `${zoomLevel.toFixed(1)}x`;
        updateTelescope();
    }
});

/**
 * Обработчик уменьшения зума
 * @event zoomOutBtn#click
 */
zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > minZoom) {
        zoomLevel -= 0.5;
        zoomValue.textContent = `${zoomLevel.toFixed(1)}x`;
        updateTelescope();
    }
});

/**
 * Обработчик изменения размера окна
 * @event window#resize
 */
window.addEventListener('resize', () => {
    const container = document.querySelector('.telescope-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    createStars();
    createComets();
    createAsteroids();
});

initCanvas();