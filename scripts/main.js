/**
 * main.js — Основной JavaScript-файл сайта «Балтийские страны»
 * Функции: мобильная навигация, плавная прокрутка, прогресс-бар,
 *          анимации при скролле, подсветка активного пункта меню
 */

/* ============================================================
   1. Мобильная навигация
   ============================================================ */
function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav    = document.getElementById('main-nav');

    if (!toggle || !nav) return;

    // Переключение меню при клике на гамбургер
    toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Закрытие меню при клике на ссылку
    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Закрытие при изменении ширины
    window.addEventListener('resize', function () {
        if (window.innerWidth > 992) {
            nav.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================================
   2. Подсветка активного пункта навигации
   ============================================================ */
function highlightActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && (href === current || href.endsWith(current))) {
            link.classList.add('active');
        }
    });
}

/* ============================================================
   3. Прогресс-бар прокрутки страницы
   ============================================================ */
function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
        var scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress     = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width  = progress + '%';
    }, { passive: true });
}

/* ============================================================
   4. Анимация появления элементов при прокрутке (Intersection Observer)
   ============================================================ */
function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    } else {
        // Резервный вариант для старых браузеров
        elements.forEach(function (el) { el.classList.add('visible'); });
    }
}

/* ============================================================
   5. Анимированные счётчики (для раздела фактов)
   ============================================================ */
function animateCounter(el, target, duration) {
    var start     = 0;
    var step      = duration / (target > 0 ? target : 1);
    var increment = Math.max(1, Math.ceil(target / (duration / 16)));
    var timer     = setInterval(function () {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = start.toLocaleString();
    }, 16);
}

function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el     = entry.target;
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    animateCounter(el, target, 1500);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { observer.observe(c); });
    } else {
        counters.forEach(function (c) {
            c.textContent = parseInt(c.getAttribute('data-count'), 10).toLocaleString();
        });
    }
}

/* ============================================================
   6. Фиксированный хедер — тень при прокрутке
   ============================================================ */
function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            header.style.boxShadow = '0 4px 24px rgba(27,74,110,0.28)';
        } else {
            header.style.boxShadow = '';
        }
    }, { passive: true });
}

/* ============================================================
   7. Плавная прокрутка для внутренних якорных ссылок
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href').slice(1);
            var target   = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                var headerH = document.querySelector('.site-header')
                    ? document.querySelector('.site-header').offsetHeight : 70;
                var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
}

/* ============================================================
   8. Текущий год в подвале
   ============================================================ */
function updateFooterYear() {
    var yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ============================================================
   Инициализация всех функций после загрузки DOM
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    highlightActiveNav();
    initScrollProgress();
    initRevealAnimations();
    initCounters();
    initStickyHeader();
    initSmoothScroll();
    updateFooterYear();
});
