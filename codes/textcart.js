/**
 * @module textcart
 * @description Модуль для обрезки длинных текстов в карточках астероидов и комет
 * Обрезает текст описания до указанной длины и добавляет многоточие
 */

/**
 * Обрезает строку до указанной максимальной длины
 * @function truncate
 * @param {string} str - Исходная строка для обрезки
 * @param {number} maxlength - Максимальная допустимая длина строки
 * @returns {string} Обрезанная строка с добавлением '…' в конце,
 *                   если исходная строка превышает maxlength,
 *                   иначе возвращает исходную строку
 * @example
 * truncate("Очень длинный текст описания астероида", 20)
 * // Возвращает: "Очень длинный текс…"
 */
function truncate(str, maxlength) {
    if (str.length > maxlength) {
        return str.slice(0, maxlength - 1) + '…';
    }
    return str;
}

/**
 * Применяет обрезку ко всем описаниям карточек после загрузки DOM
 * @event DOMContentLoaded
 * @description Находит все элементы с классом 'card-desc' и обрезает
 *              их текстовое содержимое до 100 символов
 */
document.addEventListener('DOMContentLoaded', function() {
    const cardDescs = document.querySelectorAll('.card-desc');
    const maxLength = 100;
    
    cardDescs.forEach(desc => {
        const originalText = desc.textContent;
        desc.textContent = truncate(originalText, maxLength);
    });
});