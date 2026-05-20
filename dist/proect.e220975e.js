/**
 * @module stars
 * @description Модуль для создания анимированного звездного фона с эффектом параллакса
 * Создает мерцающие звезды, которые двигаются с разной скоростью при прокрутке страницы
 */ /**
 * Создает звезды на фоне страницы
 * @function createStars
 * @description Генерирует 200 звезд со случайными:
 *              - Размером (1-3 пикселя)
 *              - Позицией на экране
 *              - Задержкой анимации мерцания
 *              - Слоем параллакса (1-3)
 *              - Длительностью анимации
 */ function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 200;
    container.innerHTML = '';
    for(let i = 0; i < starCount; i++){
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${Math.random() * 2 + 2}s`;
        const parallaxLayer = Math.floor(Math.random() * 3) + 1;
        star.setAttribute('data-layer', parallaxLayer);
        star.style.zIndex = parallaxLayer;
        container.appendChild(star);
    }
    initParallax();
}
/**
 * Инициализирует эффект параллакса для звезд
 * @function initParallax
 * @description При прокрутке страницы звезды разных слоев
 *              двигаются с разной скоростью, создавая эффект глубины
 */ function initParallax() {
    const stars = document.querySelectorAll('.star');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        stars.forEach((star)=>{
            const layer = parseInt(star.getAttribute('data-layer'));
            const speed = rate * (layer / 3);
            star.style.transform = `translateY(${speed}px)`;
        });
    });
}
/**
 * Обработчик изменения размера окна с дебаунсом
 * @function handleResize
 * @description Пересоздает звезды при изменении размера окна для корректного отображения
 */ function handleResize() {
    createStars();
}
/**
 * Создает эффект параллакса для контейнера звезд
 * @function initContainerParallax
 * @description Контейнер со звездами двигается медленнее,
 *              чем остальной контент, создавая глубину
 */ function initContainerParallax() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        container.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
}
// Инициализация звезд при полной загрузке страницы
window.addEventListener('load', createStars);
/**
 * Дебаунс для обработки изменения размера окна
 * @type {number|null}
 */ let resizeTimeout;
/**
 * Обработчик изменения размера окна с задержкой
 * @event window#resize
 */ window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});
window.addEventListener('load', function() {
    initContainerParallax();
});

//# sourceMappingURL=proect.e220975e.js.map
