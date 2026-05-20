/**
 * @module book
 * @description Модуль для отображения списка научно-популярных книг о космосе
 * Поддерживает постраничную загрузку книг и функцию "показать все"
 */

/**
 * Массив книг о космосе и астрономии
 * @constant {Array<Object>} books
 * @property {string} title - Название книги
 * @property {string} author - Автор книги
 * @property {number} year - Год издания
 */
const books = [
    { title: "Краткая история времени", author: "Стивен Хокинг", year: 2022 },
    { title: "Космос", author: "Карл Саган", year: 2020 },
    { title: "Вернер фон Браун. Человек, который продал Луну", author: "Деннис Пишкевич", year: 2011 },
    { title: "Космос Эйнштейна", author: "Митио Каку", year: 2012 },
    { title: "Черные дыры и молодые вселенные", author: "Стивен Хокинг", year: 2022 },
    { title: "Интерстеллар: Наука за кадром", author: "Кип Стивен Торн", year: 2022 },
    { title: "О Вселенной в двух словах", author: "Стивен Хокинг", year: 2017 },
    { title: "Голубая точка. Космическое будущее человечества", author: "Карл Саган", year: 2018 },
    { title: "Элегантная Вселенная. Суперструны, скрытые размерности и поиски окончательной теории", author: "Брайан Грин", year: 2011 },
    { title: "Астрофизика с космической скоростью", author: "Нил Деграсс Тайсон", year: 2022 },
    { title: "Гиперпространство. Научная одиссея через параллельные миры, дыры во времени и десятое измерение", author: "Митио Каку", year: 2018 },
    { title: "Космос Эйнштейна. Как открытия Альберта Эйнштейна изменили наши представления о пространстве и времени", author: "Митио Каку", year: 2019 },
    { title: "Всё из ничего: Как возникла Вселенная", author: "Лоренс Краусс", year: 2019 },
    { title: "Занимательная астрономия", author: "Яков Перельман", year: 2017 },
    { title: "Мир множества миров. Физики в поисках иных вселенных", author: "Александр Виленкин", year: 2018 },
    { title: "Битва при черной дыре. Мое сражение со Стивеном Хокингом за мир, безопасный для квантовой механики", author: "Леонард Сасскинд", year: 2016 },
    { title: "Как мы будем жить на Марсе", author: "Стивен Петранек", year: 2015 },
    { title: "Суперобъекты: Звезды размером с город", author: "Сергей Попов", year: 2024 },
    { title: "Природа пространства и времени", author: "Роджер Пенроуз, Стивен Хокинг", year: 2018 },
    { title: "Астрофизика начинающим: как понять Вселенную", author: "Нил Деграсс Тайсон, Грегори Мон", year: 2019 },
    { title: "Первые три минуты", author: "Стивен Вайнберг", year: 2022 },
    { title: "Теория струн и скрытые измерения Вселенной", author: "Яу Шинтан, Стив Надис", year: 2016 },
    { title: "Скрытая реальность. Параллельные миры и глубинные законы космоса", author: "Брайан Грин", year: 2012 },
    { title: "Наша математическая вселенная. В поисках фундаментальной природы реальности", author: "Макс Тегмарк", year: 2016 },
    { title: "Выбор катастроф. От гибели Вселенной до энергетического кризиса", author: "Айзек Азимов", year: 2002 },
    { title: "Вы находитесь здесь. Карманная история вселенной", author: "Кристофер Поттер", year: 2012 },
];

/**
 * Текущий индекс последней загруженной книги
 * @type {number}
 */
let currentIndex = 0;

/**
 * Количество книг, загружаемых за один раз
 * @constant {number}
 */
const booksPerLoad = 3;

/**
 * DOM элемент контейнера для книг
 * @constant {HTMLElement}
 */
const booksContainer = document.getElementById('booksContainer');

/**
 * Кнопка "Показать еще" для постраничной загрузки
 * @constant {HTMLElement}
 */
const showMoreBtn = document.getElementById('showMoreBtn');

/**
 * Кнопка "Показать все" для отображения всех книг сразу
 * @constant {HTMLElement}
 */
const showAllBtn = document.getElementById('showAllBtn');

/**
 * Создает HTML элемент для отдельной книги
 * @function createBookElement
 * @param {Object} book - Объект с информацией о книге
 * @param {string} book.title - Название книги
 * @param {string} book.author - Автор книги
 * @param {number} book.year - Год издания
 * @returns {HTMLDivElement} Div элемент с форматированной информацией о книге
 */
function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.innerHTML = `
        <strong>${book.title}</strong><br>
        Автор: ${book.author}<br>
        Год: ${book.year}
        <hr>
    `;
    return bookDiv;
}

/**
 * Отображает указанное количество книг, начиная с заданного индекса
 * @function displayBooks
 * @param {number} startIndex - Индекс, с которого начинать отображение
 * @param {number} count - Количество книг для отображения
 * @description Добавляет новые книги в контейнер и обновляет currentIndex
 */
function displayBooks(startIndex, count) {
    const endIndex = Math.min(startIndex + count, books.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const bookElement = createBookElement(books[i]);
        booksContainer.appendChild(bookElement);
    }
    
    currentIndex = endIndex;

    if (currentIndex >= books.length) {
        showMoreBtn.style.display = 'none';
        showAllBtn.style.display = 'none';
    }
}

/**
 * Отображает все книги из массива
 * @function showAllBooks
 * @description Очищает контейнер и добавляет все книги сразу,
 *              скрывает кнопки навигации
 */
function showAllBooks() {
    booksContainer.innerHTML = '';
    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksContainer.appendChild(bookElement);
    });
    showMoreBtn.style.display = 'none';
    showAllBtn.style.display = 'none';
}

// Инициализация: отображаем первые 3 книги
displayBooks(0, booksPerLoad);

/**
 * Обработчик кнопки "Показать еще"
 * @event showMoreBtn#click
 * @description Добавляет следующую партию книг
 */
showMoreBtn.addEventListener('click', () => {
    displayBooks(currentIndex, booksPerLoad);
});

/**
 * Обработчик кнопки "Показать все"
 * @event showAllBtn#click
 * @description Отображает все книги
 */
showAllBtn.addEventListener('click', showAllBooks);

// Скрываем кнопки, если книг меньше, чем загружается за раз
if (books.length <= booksPerLoad) {
    showMoreBtn.style.display = 'none';
    showAllBtn.style.display = 'none';
}