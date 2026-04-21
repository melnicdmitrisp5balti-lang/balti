/**
 * interactive.js — Интерактивные элементы сайта «Балтийские страны»
 * Включает:
 *   1. Викторина (quiz) о Балтийских странах
 *   2. Лайтбокс для галереи изображений
 *   3. Typewriter-эффект (анимированный текст)
 *   4. Интерактивная временная линия (динамическая генерация)
 *   5. Прогресс-бары популярности
 *   6. Фильтрация галереи по стране
 */

/* ============================================================
   1. ВИКТОРИНА о Балтийских странах
   ============================================================ */
var quizData = [
    {
        question: 'Какой город является столицей Эстонии?',
        options:  ['Рига', 'Вильнюс', 'Таллин', 'Тарту'],
        correct:  2,
        fact:     'Таллин — один из наиболее хорошо сохранившихся средневековых городов Европы.'
    },
    {
        question: 'Какая страна Балтии самая большая по площади?',
        options:  ['Эстония', 'Латвия', 'Литва', 'Финляндия'],
        correct:  2,
        fact:     'Литва — 65 300 км², крупнейшая из трёх прибалтийских государств.'
    },
    {
        question: 'Как называется традиционный праздник летнего солнцестояния в Латвии?',
        options:  ['Йонинес', 'Лиго (Янов день)', 'Яанипяэв', 'Купала'],
        correct:  1,
        fact:     'Лиго отмечается 23–24 июня и является одним из важнейших праздников Латвии.'
    },
    {
        question: 'Что является символом Балтийского региона и включено в ЮНЕСКО?',
        options:  ['Янтарь', 'Певческие праздники', 'Средневековые замки', 'Рыбалка'],
        correct:  1,
        fact:     'Певческие праздники (Laulupidu) занесены в список нематериального наследия ЮНЕСКО.'
    },
    {
        question: 'В каком году страны Балтии вступили в НАТО?',
        options:  ['1999', '2001', '2004', '2007'],
        correct:  2,
        fact:     'Все три страны Балтии стали членами НАТО в марте 2004 года.'
    }
];

var quizState = {
    current:  0,
    score:    0,
    answered: false
};

function initQuiz() {
    var widget = document.getElementById('quiz-widget');
    if (!widget) return;

    renderQuizQuestion();
}

function renderQuizQuestion() {
    var widget = document.getElementById('quiz-widget');
    if (!widget) return;

    var q      = quizData[quizState.current];
    var qNum   = document.getElementById('quiz-question-num');
    var qText  = document.getElementById('quiz-question-text');
    var opts   = document.getElementById('quiz-options');
    var result = document.getElementById('quiz-result');
    var nextBtn = document.getElementById('quiz-next');
    var scoreEl = document.getElementById('quiz-score');

    if (qNum)  qNum.textContent = (quizState.current + 1) + ' / ' + quizData.length;
    if (qText) qText.textContent = q.question;

    if (opts) {
        opts.innerHTML = '';
        q.options.forEach(function (opt, idx) {
            var btn = document.createElement('button');
            btn.className   = 'quiz-btn';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                if (quizState.answered) return;
                quizState.answered = true;

                // Подсветка правильного и неправильного ответов
                var allBtns = opts.querySelectorAll('.quiz-btn');
                allBtns.forEach(function (b, i) {
                    b.disabled = true;
                    if (i === q.correct) b.classList.add('correct');
                });

                if (idx === q.correct) {
                    quizState.score++;
                    if (result) {
                        result.style.color = 'var(--color-success)';
                        result.textContent = '✅ Правильно! ' + q.fact;
                    }
                } else {
                    btn.classList.add('wrong');
                    if (result) {
                        result.style.color = 'var(--color-error)';
                        result.textContent = '❌ Неверно. ' + q.fact;
                    }
                }

                if (nextBtn) nextBtn.style.display = 'inline-block';
            });
            opts.appendChild(btn);
        });
    }

    if (result)  result.textContent = '';
    if (nextBtn) {
        nextBtn.style.display = 'none';
        nextBtn.textContent   = quizState.current < quizData.length - 1
            ? 'Следующий вопрос →'
            : 'Завершить викторину';
    }

    if (scoreEl) scoreEl.textContent = 'Очки: ' + quizState.score;

    quizState.answered = false;
}

function initQuizNavigation() {
    var nextBtn = document.getElementById('quiz-next');
    var restartBtn = document.getElementById('quiz-restart');

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            quizState.current++;
            if (quizState.current < quizData.length) {
                renderQuizQuestion();
            } else {
                showQuizResult();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', function () {
            quizState.current  = 0;
            quizState.score    = 0;
            quizState.answered = false;
            var finalEl = document.getElementById('quiz-final');
            var mainEl  = document.getElementById('quiz-main');
            if (finalEl) finalEl.style.display = 'none';
            if (mainEl)  mainEl.style.display  = 'block';
            renderQuizQuestion();
        });
    }
}

function showQuizResult() {
    var finalEl = document.getElementById('quiz-final');
    var mainEl  = document.getElementById('quiz-main');
    var finalScore = document.getElementById('quiz-final-score');
    var finalMsg   = document.getElementById('quiz-final-msg');

    if (finalEl) finalEl.style.display = 'block';
    if (mainEl)  mainEl.style.display  = 'none';

    var pct = Math.round((quizState.score / quizData.length) * 100);
    if (finalScore) finalScore.textContent = quizState.score + ' из ' + quizData.length + ' (' + pct + '%)';

    var messages = [
        'Попробуйте ещё раз, вы можете лучше! 💪',
        'Неплохо! Изучите сайт подробнее. 📖',
        'Хороший результат! Вы знаете Балтию. 🌊',
        'Отлично! Вы настоящий эксперт по Балтии! 🏆'
    ];
    var level = pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
    if (finalMsg) finalMsg.textContent = messages[level];
}

/* ============================================================
   2. ЛАЙТБОКС для галереи
   ============================================================ */
function initLightbox() {
    var lightbox  = document.getElementById('lightbox');
    var lbImg     = document.getElementById('lightbox-img');
    var lbCaption = document.getElementById('lightbox-caption');
    var lbClose   = document.getElementById('lightbox-close');

    if (!lightbox) return;

    // Открытие лайтбокса при клике или нажатии Enter/Space на элемент галереи
    document.querySelectorAll('.gallery-item[data-src]').forEach(function (item) {
        function openLightbox() {
            var src     = item.getAttribute('data-src');
            var caption = item.getAttribute('data-caption') || '';
            if (lbImg)     lbImg.src = src;
            if (lbCaption) lbCaption.textContent = caption;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        item.addEventListener('click', openLightbox);

        // Поддержка клавиатуры (Enter / Space)
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox();
            }
        });
    });

    // Закрытие
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        if (lbImg) lbImg.src = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });
}

/* ============================================================
   3. TYPEWRITER-ЭФФЕКТ
   ============================================================ */
function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    var texts   = el.getAttribute('data-texts')
        ? JSON.parse(el.getAttribute('data-texts'))
        : ['Добро пожаловать в Балтию!'];
    var speed   = 80;
    var pause   = 2000;
    var idx     = 0;
    var charIdx = 0;
    var deleting = false;

    function type() {
        var current = texts[idx];
        if (!deleting) {
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, pause);
                return;
            }
        } else {
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                idx = (idx + 1) % texts.length;
            }
        }
        setTimeout(type, deleting ? speed / 2 : speed);
    }

    type();
}

/* ============================================================
   4. ДИНАМИЧЕСКАЯ ГЕНЕРАЦИЯ временной линии (history.html)
   ============================================================ */
var timelineEvents = [
    {
        year:    '~3000 до н.э.',
        title:   'Первые поселения',
        text:    'Индоевропейские племена заселяют побережье Балтийского моря.',
        icon:    '🏕️'
    },
    {
        year:    '1201',
        title:   'Основание Риги',
        text:    'Епископ Альберт фон Буксхёвден основал город Ригу — будущую столицу Латвии.',
        icon:    '🏰'
    },
    {
        year:    '1251',
        title:   'Основание Таллина',
        text:    'Датский король Вальдемар II построил замок на месте современного Таллина.',
        icon:    '⚓'
    },
    {
        year:    '1323',
        title:   'Перенос столицы Литвы',
        text:    'Великий князь Гедимин перенёс столицу Великого Литовского Княжества в Вильнюс.',
        icon:    '👑'
    },
    {
        year:    '1569',
        title:   'Люблинская уния',
        text:    'Объединение Польши и Литвы в Речь Посполитую.',
        icon:    '📜'
    },
    {
        year:    '1721',
        title:   'Присоединение к России',
        text:    'Прибалтийские территории перешли под контроль Российской империи по итогам Северной войны.',
        icon:    '🦅'
    },
    {
        year:    '1918',
        title:   'Независимость',
        text:    'Литва, Латвия и Эстония провозгласили независимость после распада Российской империи.',
        icon:    '🎉'
    },
    {
        year:    '1940',
        title:   'Советская оккупация',
        text:    'СССР оккупировал все три прибалтийские государства и включил их в состав Союза.',
        icon:    '⚠️'
    },
    {
        year:    '1991',
        title:   'Восстановление независимости',
        text:    'Балтийские государства восстановили независимость в результате революции.',
        icon:    '🕊️'
    },
    {
        year:    '2004',
        title:   'Вступление в ЕС и НАТО',
        text:    'Литва, Латвия и Эстония стали полноправными членами Европейского Союза и НАТО.',
        icon:    '🇪🇺'
    }
];

function buildTimeline() {
    var container = document.getElementById('dynamic-timeline');
    if (!container) return;

    container.innerHTML = '';

    timelineEvents.forEach(function (event, i) {
        var item = document.createElement('div');
        item.className = 'timeline-item reveal';
        item.style.animationDelay = (i * 0.08) + 's';

        var isEven = i % 2 === 1;

        item.innerHTML =
            '<div class="timeline-date">' +
            '  <span class="timeline-date-badge">' + event.year + '</span>' +
            '</div>' +
            '<div class="timeline-dot" title="' + event.year + '"></div>' +
            '<div class="timeline-content">' +
            '  <h4>' + event.icon + ' ' + event.title + '</h4>' +
            '  <p>' + event.text + '</p>' +
            '</div>';

        container.appendChild(item);
    });

    // Запускаем анимации появления
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        container.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        container.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }
}

/* ============================================================
   5. ПРОГРЕСС-БАРЫ (динамические, с данными)
   ============================================================ */
function initProgressBars() {
    var bars = document.querySelectorAll('.progress-bar[data-width]');
    if (!bars.length) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var bar   = entry.target;
                    var width = bar.getAttribute('data-width');
                    setTimeout(function () {
                        bar.style.width = width + '%';
                    }, 200);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(function (bar) { observer.observe(bar); });
    } else {
        bars.forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }
}

/* ============================================================
   6. ФИЛЬТРАЦИЯ ГАЛЕРЕИ
   ============================================================ */
function initGalleryFilter() {
    var filterBtns = document.querySelectorAll('[data-filter]');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            // Активная кнопка
            filterBtns.forEach(function (b) { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
            this.classList.add('btn-primary');
            this.classList.remove('btn-outline');

            // Показ/скрытие карточек
            galleryItems.forEach(function (item) {
                var country = item.getAttribute('data-country');
                if (filter === 'all' || country === filter) {
                    item.style.display = '';
                    item.classList.remove('hidden');
                    item.style.animation = 'scaleIn 0.35s ease both';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ============================================================
   7. АНИМАЦИЯ ПОЯВЛЕНИЯ ЧАСТИЦ (декоративный эффект на главной)
   ============================================================ */
function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var particles = [];
    var count     = Math.min(60, Math.floor(canvas.width / 20));

    for (var i = 0; i < count; i++) {
        particles.push({
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            r:  Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            a:  Math.random() * 0.5 + 0.2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(247,183,49,' + p.a + ')';
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.dy *= -1;
        });
        requestAnimationFrame(draw);
    }

    draw();
}

/* ============================================================
   Инициализация всех интерактивных элементов
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    initQuiz();
    initQuizNavigation();
    initLightbox();
    initTypewriter();
    buildTimeline();
    initProgressBars();
    initGalleryFilter();
    initParticles();
});
