const btnRegister = document.querySelector('.js-btn-registration');
const tumbler = document.querySelector('.js-tumbler');
// btnRegister.disabled = false;

const inputEmail = document.querySelector('.js-input-email');
const btnEnter = document.querySelector('.js-btn-enter');

let inputCorrect = false;
let tumblerCorrect = false;

inputEmail.addEventListener('input', (event) => {

    const validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (event.target.value.match(validRegex)) {
        inputEmail.classList.remove('validate_input_error');
        inputCorrect = true;

    } else {
        inputEmail.classList.add('validate_input_error');
        inputCorrect = false;
    }

    if (tumblerCorrect && inputCorrect) {
        btnRegister.disabled = false;
    } else {
        btnRegister.disabled = true;
    }


})

tumbler.addEventListener('change', () => {
    // if (event.target.value.match(validRegex)) {
    //     inputEmail.classList.remove('validate_input_error');
    //     inputCorrect = true;
    //
    // }
    if (inputEmail.value !== '') {
        inputCorrect = true;
    }
    if (!tumbler.checked) {
        tumblerCorrect = false;
    } else if (tumbler.checked) {
        tumblerCorrect = true;
    }
    // else if (tumbler.checked && inputEmail.value !== '') {
    //     tumblerCorrect = true;
    //     inputCorrect = true;
    //
    //
    // }
    // if (!tumbler.checked) {

    if (tumblerCorrect && inputCorrect) {
        btnRegister.disabled = false;
    } else {
        btnRegister.disabled = true;
    }
})

