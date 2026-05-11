/* ===================================================
   ФИТНЕС-ЦЕНТР "АТЛАНТ" — JavaScript
   Описание: интерактивность сайта
   =================================================== */

/* =====================
   1. МОБИЛЬНОЕ МЕНЮ
   ===================== */
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        nav.classList.toggle('open');
    });

    // Закрывать меню при клике на ссылку
    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('open');
            nav.classList.remove('open');
        });
    });
}

/* =====================
   2. АКТИВНАЯ ССЫЛКА В МЕНЮ
   ===================== */
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* =====================
   3. КНОПКА "НАВЕРХ"
   ===================== */
function initScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =====================
   4. MODAL / POPUP
   ===================== */
function initModal() {
    const overlay = document.querySelector('.modal-overlay');
    const openBtns = document.querySelectorAll('[data-modal]');
    const closeBtn = document.querySelector('.modal-close');

    if (!overlay) return;

    // Открыть модальное окно
    openBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Закрыть по кнопке
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            closeModal(overlay);
        });
    }

    // Закрыть при клике на фон
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });

    // Закрыть по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal(overlay);
        }
    });
}

function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

/* =====================
   5. ФИЛЬТР РАСПИСАНИЯ
   ===================== */
function initScheduleFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.schedule-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Убираем активный класс со всех кнопок
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            // Показываем/скрываем элементы расписания
            items.forEach(function (item) {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // Обновляем счётчики в заголовках дней
            updateDayCounters();
        });
    });
}

/* Обновление счётчиков видимых занятий по дням */
function updateDayCounters() {
    document.querySelectorAll('.schedule-day').forEach(function (day) {
        var visible = 0;
        day.querySelectorAll('.schedule-item').forEach(function (item) {
            if (item.style.display !== 'none') visible++;
        });
        var counter = day.querySelector('.day-count');
        if (counter) {
            counter.textContent = visible + ' занятий';
        }
    });
}

/* =====================
   6. ВАЛИДАЦИЯ ФОРМЫ
   ===================== */
function initContactForm() {
    const form = document.querySelector('#contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm(form)) {
            // Показываем сообщение об успехе
            var formBlock = form.closest('.contact-form-block');
            var successMsg = formBlock.querySelector('.form-success');
            if (successMsg) {
                form.style.display = 'none';
                successMsg.classList.add('show');
            }
        }
    });

    // Снимать ошибку при вводе
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
            clearError(field);
        });
    });
}

function validateForm(form) {
    var isValid = true;

    // Имя
    var name = form.querySelector('#name');
    if (name && name.value.trim().length < 2) {
        showError(name, 'Введите ваше имя (минимум 2 символа)');
        isValid = false;
    }

    // Email
    var email = form.querySelector('#email');
    if (email) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            showError(email, 'Введите корректный e-mail адрес');
            isValid = false;
        }
    }

    // Телефон
    var phone = form.querySelector('#phone');
    if (phone && phone.value.trim()) {
        var phonePattern = /^[\+]?[\d\s\-\(\)]{7,15}$/;
        if (!phonePattern.test(phone.value.trim())) {
            showError(phone, 'Введите корректный номер телефона');
            isValid = false;
        }
    }

    // Тема
    var subject = form.querySelector('#subject');
    if (subject && subject.value === '') {
        showError(subject, 'Выберите тему обращения');
        isValid = false;
    }

    // Сообщение
    var message = form.querySelector('#message');
    if (message && message.value.trim().length < 10) {
        showError(message, 'Сообщение слишком короткое (минимум 10 символов)');
        isValid = false;
    }

    return isValid;
}

function showError(field, msg) {
    field.classList.add('error');
    var errEl = field.parentElement.querySelector('.error-msg');
    if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('show');
    }
}

function clearError(field) {
    field.classList.remove('error');
    var errEl = field.parentElement.querySelector('.error-msg');
    if (errEl) {
        errEl.classList.remove('show');
    }
}

/* =====================
   7. МОДАЛЬНАЯ ФОРМА ЗАПИСИ
   ===================== */
function initModalForm() {
    const form = document.querySelector('#signupForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameField = form.querySelector('#modalName');
        var phoneField = form.querySelector('#modalPhone');
        var valid = true;

        if (!nameField || nameField.value.trim().length < 2) {
            if (nameField) showError(nameField, 'Введите имя');
            valid = false;
        }

        if (!phoneField || phoneField.value.trim().length < 7) {
            if (phoneField) showError(phoneField, 'Введите телефон');
            valid = false;
        }

        if (valid) {
            // Показываем подтверждение
            form.innerHTML = '<div class="form-success show"><div class="success-icon">✅</div><h3>Заявка принята!</h3><p>Мы перезвоним вам в ближайшее время.</p></div>';
        }
    });
}

/* =====================
   8. ПЛАВНАЯ АНИМАЦИЯ ПОЯВЛЕНИЯ
   ===================== */
function initScrollAnimation() {
    var elements = document.querySelectorAll('.feature-card, .service-card, .trainer-card, .service-full-card, .pricing-card');

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

/* =====================
   ИНИЦИАЛИЗАЦИЯ
   ===================== */
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    setActiveNav();
    initScrollTop();
    initModal();
    initScheduleFilter();
    initContactForm();
    initModalForm();
    initScrollAnimation();
});