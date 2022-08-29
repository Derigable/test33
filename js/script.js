window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /**
     * Инициализирует табы, включает показывание нужного контента по клику на таб
     * 
     * @param {string} tabClass Класс таба 
     * @param {string} tabParentClass Класс родителей таба
     * @param {string} tabContentClass Класс контента таба
     */
    function tabsInitialize(tabClass, tabParentClass, tabContentClass) {
        let headerTab = document.querySelectorAll(`.${tabClass}`),
        header = document.querySelector(`.${tabParentClass}`),
        tabContent = document.querySelectorAll(`.${tabContentClass}`);
        
        /**
         * Прячем табы, начиная с переданного индекса таба
         * 
         * @param {number} tabIndex Индекс таба, начиная с которого надо прятать табы
         */
        function hideTabContent(tabIndex = 0) {
            for (let i = tabIndex; i < tabContent.length; i++) {
                tabContent[i].classList.remove('show');
                tabContent[i].classList.add('hide');
            }
        }

        hideTabContent(1);

        /**
         * Показываем таб
         * 
         * @param {number} tabIndex Индекс таба, который нужно показать 
         */
        function showTabContent(tabIndex = 0) {
            if (tabContent[tabIndex].classList.contains('hide')) {
                tabContent[tabIndex].classList.remove('hide');
                tabContent[tabIndex].classList.add('show');
            }   
        }

        header.addEventListener('click', function(event) {
            let target = event.target;
            if (target && target.classList.contains(`${tabClass}`)) {
                for (let i = 0; i < headerTab.length; i++) {
                    if (target == headerTab[i]) {
                        hideTabContent(0);
                        showTabContent(i);
                        break;
                    }
                }
            }
        });
    }

    tabsInitialize('info-header-tab', 'info-header', 'info-tabcontent');


    /**
     * Устанавливаем таймер обратного отсчета
     * 
     * @param {string} id Id divа, в котором прописывается сам таймер
     * @param {string} endTime дата окончания таймера, в формате ГГГГ-ММ-ДД 
     */
    function setTimer(id, endTime) {
        let timer = document.getElementById(id),
            seconds = timer.querySelector('.seconds'),
            minutes = timer.querySelector('.minutes'),
            hours = timer.querySelector('.hours'),
            timeInterval = setInterval(updateTimer, 1000);
        
        /**
         * Обновляем значения таймера
         */
        function updateTimer() {
            let remainingTime = getTimeRemaining(endTime);
            hours.textContent = remainingTime.hours;
            minutes.textContent = remainingTime.minutes;
            seconds.textContent = remainingTime.seconds;

            if (remainingTime.remainingTime <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }

        /**
         * Вычисляем оставшееся время работы таймера
         * 
         * @param {string} endTime Дата, до которой надо запускать таймер,  в формате ГГГГ-ММ-ДД
         */
        function getTimeRemaining(endTime) {
            let remainingTime = Date.parse(endTime) - Date.parse(new Date()),
                seconds = Math.floor((remainingTime / 1000) % 60),
                minutes = Math.floor((remainingTime / 1000 / 60) % 60),
                hours = Math.floor((remainingTime / (1000 * 60 * 60)));
    
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            if (hours < 10) {
                hours = `0${hours}`;
            }
    
            return {
                'remainingTime': remainingTime,
                'seconds': seconds,
                'minutes': minutes,
                'hours': hours
            };
        }
    }

    setTimer('timer', '2020-06-28');

    let moreBtn = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        popUpClose = document.querySelector('.popup-close');

    moreBtn.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    popUpClose.addEventListener('click', function() {
        overlay.style.display = 'none';
        moreBtn.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    let infoClass = document.querySelector('.info');

    infoClass.addEventListener('click', function(event) {
        if (event.target.classList.contains('description-btn') ) {
            overlay.style.display = 'block';
            this.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        }
    });

    // форма обратной связи 
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');
    
    statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let formData = new FormData(form);

        function postData(data) {
            return new Promise(function(resolve, reject) {

                let request = new XMLHttpRequest();
                request.open('POST', 'server.php');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                request.onreadystatechange = function() {
                    if (request.readyState < 4) {
                        resolve();
                    } else if (request.readyState === 4 && request.status == 200) {
                        resolve(); 
                    } else {
                        reject();
                    }
                };
                request.send(formData);
            });          
        }  

        function clearInput() {
            for (let i = 0; i < input.length; i++) {
                input[i].value = '';
            }
        }

        postData(formData)
            .then(()=> statusMessage.innerHTML = message.loading)
            .then(()=> statusMessage.innerHTML = message.success)
            .catch(()=> statusMessage.innerHTML = message.failure)
            .then(clearInput);
    });

    // форма контакты 
    let formContacts = document.getElementById('form'),
        inputContacts = formContacts.getElementsByTagName('input'),
        statusMessageContacts = document.createElement('div');

    statusMessageContacts.classList.add('status');

    formContacts.addEventListener('submit', function(event) {
        event.preventDefault();
        formContacts.appendChild(statusMessageContacts);

        let formContactsData = new FormData(formContacts);
        
        function postData(data) {
            return new Promise(function(resolve, reject) {

                let request = new XMLHttpRequest();
                request.open('POST', 'server.php');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                request.onreadystatechange = function() {
                    if (request.readyState < 4) {
                        resolve();
                    } else if (request.readyState === 4 && request.status == 200) {
                        resolve(); 
                    } else {
                        reject();
                    }
                };
                request.send(formContactsData);
            });   
        }   

            function clearInput() {
                for (let i = 0; i < inputContacts.length; i++) {
                    inputContacts[i].value = '';
                }
            }

        postData(formContactsData)
            .then(()=> statusMessageContacts.innerHTML = message.loading)
            .then(()=> statusMessageContacts.innerHTML = message.success)
            .catch(()=> statusMessageContacts.innerHTML = message.failure)
            .then(clearInput);
        
    });


    // Слайдер

    addSlider();

    function addSlider() {
        let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

        showSlides(slideIndex);

        function showSlides(number) {

            if (number > slides.length) {
                slideIndex = 1;
            } else if (number < 1) {
                slideIndex = slides.length;
            }

            slides.forEach((item) => item.style.display = 'none');
            dots.forEach((item) => item.classList.remove('dot-active'));

            slides[slideIndex - 1].style.display = 'block';
            dots[slideIndex - 1].classList.add('dot-active');
        };

        function plusSlide(number) {
            showSlides(slideIndex += number);
        };

        function currentSlide(number) {
            showSlides(slideIndex = number);
        }

        prev.addEventListener('click', function() {
            plusSlide(-1);
        });

        next.addEventListener('click', function() {
            plusSlide(1);
        });

        dotsWrap.addEventListener('click', function(event) {
            for (let i = 0; i < dots.length + 1; i++) {
                if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                    currentSlide(i);
                }
            }
        });
    }

    
    // Калькулятор 

    addCalculator();

    function addCalculator() {
        let totalField = document.getElementById('total'),
        peopleCountField = document.querySelectorAll('.counter-block-input')[0],
        daysCountField = document.querySelectorAll('.counter-block-input')[1],
        peopleCount = '',
        daysCount = '',
        total = '',
        placeModificator = 1,
        selectOptions = document.getElementById('select');

        totalField.innerHTML = 0;

        peopleCountField.addEventListener('change', function() {
            peopleCount = +this.value;
            total = (peopleCount + daysCount) * 4000 * placeModificator;

            if (daysCountField.value !== '' && peopleCount !== 0) {
                totalField.innerHTML = total;
            } else totalField.innerHTML = 0;       
        });

        daysCountField.addEventListener('change', function() {
            daysCount = +this.value;
            total = (peopleCount + daysCount) * 4000 * placeModificator;

            if (peopleCountField.value !== '' && daysCount !== 0) {
                totalField.innerHTML = total;
            } else totalField.innerHTML = 0;        
        });

        selectOptions.addEventListener('change', function() {
            if (daysCountField.value == '' || peopleCountField.value == '') {
                totalField.innerHTML = 0;
            } else {
                placeModificator = +this.options[this.selectedIndex].value;
                totalField.innerHTML = (peopleCount + daysCount) * 4000 * placeModificator;
            }
        });
    } 

});



