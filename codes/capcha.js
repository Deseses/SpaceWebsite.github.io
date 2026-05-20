/**
 * @module capcha
 * @description Модуль CAPTCHA для проверки пользователя при регистрации
 * Поддерживает текстовую и математическую капчу, автоматически переключается
 * между типами при ошибках
 */

/**
 * Проверяет, является ли объект пустым
 * @function isEmpty
 * @param {Object} obj - Проверяемый объект
 * @returns {boolean} true если объект пустой, false если содержит свойства
 * @example
 * isEmpty({}) // true
 * isEmpty({input: "hello"}) // false
 */
function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

/**
 * Текущее значение капчи (текст или объект с примером)
 * @type {string|Object}
 */
let currentCaptcha = '';

/**
 * Флаг типа капчи (true - текстовая, false - математическая)
 * @type {boolean}
 */
let isTextCaptcha = true;

/**
 * Длина правильного ответа капчи (для проверки ввода)
 * @type {number}
 */
let captchaLength = 0;

/**
 * Генерирует случайную текстовую капчу
 * @function generateTextCaptcha
 * @returns {string} Случайная строка из символов AaBbCcDdEeFfGg123
 * @description Создает строку из 6 случайных символов
 */
function generateTextCaptcha() {
    const chars = 'AaBbCcDdEeFfGg123';
    let result = '';
    const length = 6; 
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaLength = length;
    return result;
}

/**
 * Генерирует математическую капчу (сложение двух чисел)
 * @function generateMathCaptcha
 * @returns {Object} Объект с текстом примера и правильным ответом
 * @property {string} text - Текст примера (например "5 + 3 = ?")
 * @property {number} answer - Правильный ответ
 */
function generateMathCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaLength = (a + b).toString().length;
    return {
        text: a + ' + ' + b + ' = ?',
        answer: a + b
    };
}

/**
 * Создает новую капчу в зависимости от текущего типа
 * @function createCaptcha
 * @description Обновляет DOM элемент с текстом капчи
 */
function createCaptcha() {
    if (isTextCaptcha) {
        currentCaptcha = generateTextCaptcha();
        document.getElementById('captchaText').textContent = 'Введите текст: ' + currentCaptcha;
    } else {
        currentCaptcha = generateMathCaptcha();
        document.getElementById('captchaText').textContent = 'Решите пример: ' + currentCaptcha.text;
    }
}

/**
 * Проверяет введенный пользователем ответ
 * @function checkInput
 * @description Сравнивает ввод пользователя с правильным ответом,
 *              разблокирует кнопку отправки при правильном ответе,
 *              переключает на математическую капчу при ошибке в текстовой
 */
function checkInput() {
    const userInput = document.getElementById('userInput').value;
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    if (isEmpty({input: userInput})) {
        submitBtn.disabled = true;
        message.textContent = '';
        return;
    }

    if (userInput.length === captchaLength) {
        let isCorrect = false;

        if (isTextCaptcha) {
            isCorrect = userInput === currentCaptcha;
        } else {
            isCorrect = parseInt(userInput) === currentCaptcha.answer;
        }

        if (isCorrect) {
            message.textContent = 'Верно! Форма разблокирована.';
            message.className = 'success';
            submitBtn.disabled = false;
        } else {
            message.textContent = 'Неверно!';
            message.className = 'error';
            submitBtn.disabled = true;
            
            // При ошибке в текстовой капче переключаемся на математическую
            if (isTextCaptcha) {
                isTextCaptcha = false;
                createCaptcha();
                document.getElementById('userInput').value = '';
                message.textContent = 'Попробуйте решить пример';
            }
        }
    } else {
        message.textContent = '';
        submitBtn.disabled = true;
    }
}

// Инициализация первой капчи
createCaptcha();

/**
 * Обработчик ввода в поле капчи
 * @event userInput#input
 * @description Вызывает проверку при каждом изменении текста
 */
document.getElementById('userInput').addEventListener('input', checkInput);

/**
 * Обработчик отправки формы
 * @event submitBtn#click
 * @description Показывает сообщение об успешной отправке и сбрасывает форму
 */
document.getElementById('submitBtn').onclick = function() {
    alert('Форма отправлена!');
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('userInput').value = '';
    document.getElementById('message').textContent = '';
    isTextCaptcha = true;
    createCaptcha();
};