// Получаем элементы DOM
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const telescope = document.getElementById('telescope');
const telescopeView = document.getElementById('telescope-view');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomValue = document.getElementById('zoom-value');

// Настройки
let stars = [];
let comets = [];
let asteroids = [];
let mouseX = 0;
let mouseY = 0;
let telescopeSize = 200;
let zoomLevel = 1;
const maxZoom = 8;
const minZoom = 0.5;
let animationId;

// Инициализация канваса
function initCanvas() {
    const container = document.querySelector('.telescope-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    createStars();
    createComets();
    createAsteroids();
    
    animate();
}

// Создание звезд
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

// Создание комет
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

// Создание астероидов
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

// Отрисовка звездного неба
function drawStars(time) {
    // Очищаем экран
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем звезды с мерцанием
    stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
        ctx.fill();
    });
    
    // Рисуем кометы
    comets.forEach(comet => {
        // Хвост кометы
        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(
            comet.x - comet.speedX * comet.tailLength,
            comet.y - comet.speedY * comet.tailLength
        );
        ctx.strokeStyle = `rgba(200, 230, 255, 0.7)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Ядро кометы
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
        ctx.fillStyle = comet.color;
        ctx.fill();
    });
    
    // Рисуем астероиды
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        // Неровная форма астероида
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

// Обновление позиций комет и астероидов
function updatePositions() {
    // Обновляем позиции комет
    comets.forEach(comet => {
        comet.x += comet.speedX;
        comet.y += comet.speedY;
        
        // Если комета вышла за границы, возвращаем ее
        if (comet.x < -50) comet.x = canvas.width + 50;
        if (comet.x > canvas.width + 50) comet.x = -50;
        if (comet.y < -50) comet.y = canvas.height + 50;
        if (comet.y > canvas.height + 50) comet.y = -50;
    });
    
    // Обновляем позиции астероидов
    asteroids.forEach(asteroid => {
        asteroid.x += asteroid.speedX;
        asteroid.y += asteroid.speedY;
        asteroid.rotation += asteroid.rotationSpeed;
        
        // Если астероид вышел за границы, возвращаем его
        if (asteroid.x < -30) asteroid.x = canvas.width + 30;
        if (asteroid.x > canvas.width + 30) asteroid.x = -30;
        if (asteroid.y < -30) asteroid.y = canvas.height + 30;
        if (asteroid.y > canvas.height + 30) asteroid.y = -30;
    });
}

// Анимация
function animate(time) {
    updatePositions();
    drawStars(time * 0.001);
    animationId = requestAnimationFrame(animate);
    
    // Обновляем телескоп, если он активен
    if (telescope.style.display === 'block') {
        updateTelescope();
    }
}

// Обновление позиции телескопа
function updateTelescope() {
    telescope.style.display = 'block';
    telescope.style.left = `${mouseX}px`;
    telescope.style.top = `${mouseY}px`;
    telescope.style.width = `${telescopeSize}px`;
    telescope.style.height = `${telescopeSize}px`;
    
    // Создаем канвас для увеличенного вида
    const viewCanvas = document.createElement('canvas');
    const viewCtx = viewCanvas.getContext('2d');
    viewCanvas.width = telescopeSize;
    viewCanvas.height = telescopeSize;
    
    // Вычисляем область для увеличения
    const zoomAreaSize = telescopeSize / zoomLevel;
    const zoomX = mouseX - zoomAreaSize / 2;
    const zoomY = mouseY - zoomAreaSize / 2;
    
    // Рисуем увеличенную область
    viewCtx.drawImage(
        canvas, 
        zoomX, zoomY, zoomAreaSize, zoomAreaSize,
        0, 0, telescopeSize, telescopeSize
    );
    
    // Добавляем эффект линзы
    const gradient = viewCtx.createRadialGradient(
        telescopeSize/2, telescopeSize/2, 0,
        telescopeSize/2, telescopeSize/2, telescopeSize/2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    viewCtx.fillStyle = gradient;
    viewCtx.fillRect(0, 0, telescopeSize, telescopeSize);
    
    // Очищаем и добавляем новый канвас
    telescopeView.innerHTML = '';
    telescopeView.appendChild(viewCanvas);
}

// Обработчики событий
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    updateTelescope();
});

canvas.addEventListener('mouseenter', () => {
    telescope.style.display = 'block';
    updateTelescope();
});

canvas.addEventListener('mouseleave', () => {
    telescope.style.display = 'none';
});

zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < maxZoom) {
        zoomLevel += 0.5;
        zoomValue.textContent = `${zoomLevel.toFixed(1)}x`;
        updateTelescope();
    }
});

zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > minZoom) {
        zoomLevel -= 0.5;
        zoomValue.textContent = `${zoomLevel.toFixed(1)}x`;
        updateTelescope();
    }
});

window.addEventListener('resize', () => {
    const container = document.querySelector('.telescope-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    createStars();
    createComets();
    createAsteroids();
});

// Инициализация
initCanvas();