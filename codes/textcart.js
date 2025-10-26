function truncate(str, maxlength) {
    if (str.length > maxlength) {
        return str.slice(0, maxlength - 1) + '…';
    }
    return str;
}

// Применяем функцию ко всем описаниям карточек
document.addEventListener('DOMContentLoaded', function() {
    const cardDescs = document.querySelectorAll('.card-desc');
    const maxLength = 100; // Максимальная длина текста
    
    cardDescs.forEach(desc => {
        const originalText = desc.textContent;
        desc.textContent = truncate(originalText, maxLength);
    });
});