function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

let currentCaptcha = '';
let isTextCaptcha = true;
let captchaLength = 0;

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

function generateMathCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaLength = (a + b).toString().length;
    return {
        text: a + ' + ' + b + ' = ?',
        answer: a + b
    };
}

function createCaptcha() {
    if (isTextCaptcha) {
        currentCaptcha = generateTextCaptcha();
        document.getElementById('captchaText').textContent = 'Введите текст: ' + currentCaptcha;
    } else {
        currentCaptcha = generateMathCaptcha();
        document.getElementById('captchaText').textContent = 'Решите пример: ' + currentCaptcha.text;
    }
}

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

createCaptcha();

document.getElementById('userInput').addEventListener('input', checkInput);

document.getElementById('submitBtn').onclick = function() {
    alert('Форма отправлена!');
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('userInput').value = '';
    document.getElementById('message').textContent = '';
    isTextCaptcha = true;
    createCaptcha();
};