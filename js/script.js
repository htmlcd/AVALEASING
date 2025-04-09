document.addEventListener('DOMContentLoaded', function() {
    // Получаем все кнопки "Подробнее" и модальные окна
    const detailButtons = document.querySelectorAll('.details-button');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Открытие модального окна при клике на кнопку "Подробнее"
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
        });
    });

    // Закрытие модального окна при клике на крестик
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Слайдер
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Автоматическое переключение слайдов каждые 5 секунд
    setInterval(nextSlide, 5000);
    showSlide(0);

    // Анимация появления элементов при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Добавляем наблюдение за элементами
    document.querySelectorAll('.car-card, .advantage-card, .benefit-item, .step').forEach(element => {
        observer.observe(element);
    });

    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация при наведении на кнопки
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Добавление класса для фиксированного header при скролле
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
    });

    // Маска для телефона
    document.querySelectorAll('input[name="phone"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '')
                .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + ') ' + (x[3] ? x[3] + '-' + x[4] : x[3]) + (x[4] && x[5] ? '-' + x[5] : '');
        });
    });

    // Валидация формы
    document.querySelectorAll('.application-form').forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.setAttribute('disabled', 'disabled');

        form.addEventListener('input', function(e) {
            const name = form.querySelector('input[name="name"]').value;
            const phone = form.querySelector('input[name="phone"]').value;
            
            if (name.length >= 2 && phone.replace(/\D/g, '').length === 11) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'disabled');
            }
        });
    });

    // Обработка отправки формы
    document.querySelectorAll('.application-form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-button');
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            const name = this.querySelector('input[name="name"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const car = this.querySelector('input[name="car"]').value;

            try {
                // Отправляем email через EmailJS
                const response = await emailjs.send(
                    "BHk79JPNvYnGthPdi", // Service ID
                    "template_xxxxxxx", // Замените на ваш Template ID
                    {
                        to_email: "avaleasing20@gmail.com",
                        from_name: "AVA Leasing Website",
                        subject: `Новая заявка на ${car}`,
                        name: name,
                        phone: phone,
                        car: car
                    }
                );

                if (response.status === 200) {
                    alert('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
                    this.reset();
                    // Закрываем модальное окно
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                } else {
                    throw new Error('Ошибка при отправке формы');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить заявку';
            }
        });
    });
}); 