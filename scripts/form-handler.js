/**
 * form-handler.js — Обработчик формы обратной связи
 * Функции: валидация полей, вывод ошибок, имитация отправки,
 *          отображение введённых данных пользователю
 */

/* ============================================================
   Вспомогательные функции валидации
   ============================================================ */

/** Проверяет, не пуста ли строка */
function isNotEmpty(value) {
    return value.trim().length > 0;
}

/** Проверяет корректность email */
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Проверяет, что строка содержит минимальное число символов */
function hasMinLength(value, min) {
    return value.trim().length >= min;
}

/** Показывает ошибку под полем */
function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

/** Снимает ошибку с поля */
function clearFieldError(field) {
    field.classList.remove('error');
    field.classList.add('success');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

/** Полностью сбрасывает состояние поля */
function resetFieldState(field) {
    field.classList.remove('error', 'success');
    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) errorEl.style.display = 'none';
}

/* ============================================================
   Валидация отдельного поля
   ============================================================ */
function validateField(field) {
    var value = field.value;
    var type  = field.type;
    var id    = field.id;

    if (id === 'cf-name') {
        if (!isNotEmpty(value)) {
            showFieldError(field, 'Введите ваше имя.');
            return false;
        }
        if (!hasMinLength(value, 2)) {
            showFieldError(field, 'Имя должно содержать минимум 2 символа.');
            return false;
        }
    }

    if (id === 'cf-email') {
        if (!isNotEmpty(value)) {
            showFieldError(field, 'Введите ваш email.');
            return false;
        }
        if (!isValidEmail(value)) {
            showFieldError(field, 'Введите корректный адрес email.');
            return false;
        }
    }

    if (id === 'cf-country') {
        if (!isNotEmpty(value) || value === '') {
            showFieldError(field, 'Выберите страну.');
            return false;
        }
    }

    if (id === 'cf-message') {
        if (!isNotEmpty(value)) {
            showFieldError(field, 'Введите ваше сообщение.');
            return false;
        }
        if (!hasMinLength(value, 10)) {
            showFieldError(field, 'Сообщение должно содержать минимум 10 символов.');
            return false;
        }
    }

    clearFieldError(field);
    return true;
}

/* ============================================================
   Отображение введённых данных пользователю (динамический контент)
   ============================================================ */
function showSubmittedData(data) {
    var container = document.getElementById('submitted-data');
    if (!container) return;

    var interestLabels = {
        history:     'История',
        culture:     'Культура',
        tourism:     'Туризм',
        language:    'Языки',
        cuisine:     'Кухня'
    };

    var topicText = data.topic
        ? (interestLabels[data.topic] || data.topic)
        : 'Не указана';

    var subjectsHtml = '';
    if (data.subjects && data.subjects.length > 0) {
        subjectsHtml = data.subjects
            .map(function (s) { return '<span class="tag">' + (interestLabels[s] || s) + '</span>'; })
            .join(' ');
    }

    container.innerHTML =
        '<div class="alert alert-success show" style="background: rgba(27,74,110,0.06); border-color: rgba(27,74,110,0.25); color: var(--color-primary);">' +
        '  <strong>✅ Спасибо, ' + escapeHtml(data.name) + '!</strong> Ваше сообщение получено.<br>' +
        '  <hr style="margin:0.75rem 0; border-color: rgba(27,74,110,0.15);">' +
        '  <table style="font-size:0.9rem; width:100%; border-collapse:collapse;">' +
        '    <tr><td style="padding:3px 0; color:var(--color-muted); width:40%">Имя:</td>' +
        '        <td><strong>' + escapeHtml(data.name) + '</strong></td></tr>' +
        '    <tr><td style="padding:3px 0; color:var(--color-muted)">Email:</td>' +
        '        <td><strong>' + escapeHtml(data.email) + '</strong></td></tr>' +
        '    <tr><td style="padding:3px 0; color:var(--color-muted)">Страна:</td>' +
        '        <td><strong>' + escapeHtml(data.country) + '</strong></td></tr>' +
        '    <tr><td style="padding:3px 0; color:var(--color-muted)">Тема:</td>' +
        '        <td><strong>' + topicText + '</strong></td></tr>' +
        (subjectsHtml
            ? '<tr><td style="padding:3px 0; color:var(--color-muted)">Интересы:</td>' +
              '    <td>' + subjectsHtml + '</td></tr>'
            : '') +
        '    <tr><td style="padding:3px 0; color:var(--color-muted); vertical-align:top">Сообщение:</td>' +
        '        <td style="font-style:italic">"' + escapeHtml(data.message) + '"</td></tr>' +
        '  </table>' +
        '</div>';

    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Экранирование HTML для безопасного вывода */
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

/* ============================================================
   Счётчик символов для textarea
   ============================================================ */
function initCharCounter() {
    var textarea = document.getElementById('cf-message');
    var counter  = document.getElementById('char-counter');
    if (!textarea || !counter) return;

    var maxLen = 500;

    textarea.addEventListener('input', function () {
        var len = this.value.length;
        counter.textContent = len + ' / ' + maxLen;
        counter.style.color = len > maxLen * 0.9 ? 'var(--color-error)' : 'var(--color-muted)';
    });
}

/* ============================================================
   Основная обработка формы
   ============================================================ */
function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    // Счётчик символов
    initCharCounter();

    // Валидация в реальном времени при потере фокуса
    var fields = ['cf-name', 'cf-email', 'cf-country', 'cf-message'];
    fields.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('blur', function () { validateField(this); });
            el.addEventListener('input', function () {
                if (this.classList.contains('error')) validateField(this);
            });
        }
    });

    // Обработка отправки формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Валидируем все поля
        var valid = true;
        fields.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && !validateField(el)) valid = false;
        });

        if (!valid) {
            var firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        // Получаем выбранную тему
        var selectedTopic = form.querySelector('input[name="cf-topic"]:checked');

        // Собираем интересы (чекбоксы)
        var subjects = [];
        form.querySelectorAll('input[name="cf-subject"]:checked').forEach(function (cb) {
            subjects.push(cb.value);
        });

        // Данные формы
        var data = {
            name:     document.getElementById('cf-name').value.trim(),
            email:    document.getElementById('cf-email').value.trim(),
            country:  document.getElementById('cf-country').options[
                          document.getElementById('cf-country').selectedIndex
                      ].text,
            topic:    selectedTopic ? selectedTopic.value : null,
            subjects: subjects,
            message:  document.getElementById('cf-message').value.trim()
        };

        // Имитация отправки с показом спиннера
        var submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка…';

        setTimeout(function () {
            submitBtn.disabled  = false;
            submitBtn.textContent = 'Отправить сообщение';
            showSubmittedData(data);
            form.reset();
            // Сбрасываем состояния полей
            fields.forEach(function (id) {
                var el = document.getElementById(id);
                if (el) resetFieldState(el);
            });
            var counter = document.getElementById('char-counter');
            if (counter) counter.textContent = '0 / 500';
        }, 900);
    });
}

/* ============================================================
   Инициализация
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
});
