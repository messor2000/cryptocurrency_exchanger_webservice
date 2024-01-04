const burgerBtn = document.querySelector('.js-burger-icon');
const burgerBlock = document.querySelector('.js-burger-menu');
const overlay = document.querySelector('.js-overlay');
const close = document.querySelector('.js-close');

burgerBtn.addEventListener('click', () => {
    burgerBlock.classList.toggle('activeBurger');
    overlay.classList.toggle('activeOverlay');

});
overlay.addEventListener('click', () => {
    burgerBlock.classList.remove('activeBurger');
    overlay.classList.remove('activeOverlay');
})
close.addEventListener('click', () => {
    burgerBlock.classList.remove('activeBurger');
    overlay.classList.remove('activeOverlay');
})