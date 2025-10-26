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

let currentIndex = 0;
const booksPerLoad = 3;
const booksContainer = document.getElementById('booksContainer');
const showMoreBtn = document.getElementById('showMoreBtn');
const showAllBtn = document.getElementById('showAllBtn');

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

function showAllBooks() {
    booksContainer.innerHTML = '';
    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksContainer.appendChild(bookElement);
    });
    showMoreBtn.style.display = 'none';
    showAllBtn.style.display = 'none';
}

displayBooks(0, booksPerLoad);

showMoreBtn.addEventListener('click', () => {
    displayBooks(currentIndex, booksPerLoad);
});

showAllBtn.addEventListener('click', showAllBooks);

if (books.length <= booksPerLoad) {
    showMoreBtn.style.display = 'none';
    showAllBtn.style.display = 'none';
}