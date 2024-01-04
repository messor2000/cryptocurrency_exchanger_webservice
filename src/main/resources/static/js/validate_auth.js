const inputEmail = document.querySelector('.js-input-email');
const btnEnter = document.querySelector('.js-btn-enter');

inputEmail.addEventListener('input', (event) => {
    console.log('works on input');
    console.log(event.target.value)
    const validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (event.target.value.match(validRegex)) {

        console.log('yes');
        inputEmail.classList.remove('validate_input_error');
        btnEnter.disabled = false;

    } else {

        console.log('not');
        inputEmail.classList.add('validate_input_error');
        btnEnter.disabled = true;
    }


})