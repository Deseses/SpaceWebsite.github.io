// Скрипт для создания звездного фона с эффектом параллакса
function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 200; // Количество звезд
            
    // Очищаем контейнер перед созданием новых звезд
    container.innerHTML = '';
            
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Случайный размер от 1 до 3 пикселей
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
                
        // Случайная позиция
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
                
        // Случайная задержка анимации
        star.style.animationDelay = `${Math.random() * 3}s`;
                
        // Случайная длительность анимации
        star.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        // Добавляем слой параллакса (разные звезды двигаются с разной скоростью)
        const parallaxLayer = Math.floor(Math.random() * 3) + 1; // 1, 2 или 3
        star.setAttribute('data-layer', parallaxLayer);
        star.style.zIndex = parallaxLayer;
                
        container.appendChild(star);
    }
    
    // Инициализируем эффект параллакса
    initParallax();
}

// Функция для инициализации эффекта параллакса
function initParallax() {
    const stars = document.querySelectorAll('.star');
    
    // Обработчик события прокрутки
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5; // Коэффициент параллакса
        
        stars.forEach(star => {
            const layer = parseInt(star.getAttribute('data-layer'));
            // Разные слои двигаются с разной скоростью
            const speed = rate * (layer / 3);
            star.style.transform = `translateY(${speed}px)`;
        });
    });
}

// Улучшенная функция для обработки изменения размера окна
function handleResize() {
    createStars();
}

// Создаем звезды при загрузке страницы
window.addEventListener('load', createStars);

// Также создаем звезды при изменении размера окна (с debounce)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

// Дополнительный эффект параллакса для контейнера
function initContainerParallax() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        // Контейнер двигается медленнее, создавая глубину
        container.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
}

// Инициализируем параллакс для контейнера при загрузке
window.addEventListener('load', function() {
    initContainerParallax();
});