// const password1Input = document.querySelector('.js-password1');
const password2Input = document.querySelector('.js-password2');
const password3Input = document.querySelector('.js-password3');

// Add input event listeners to all three password fields
// password1Input.addEventListener('input', validatePasswords);
password2Input.addEventListener('input', validatePasswords);
password3Input.addEventListener('input', validatePasswords);

function validatePasswords() {
    const password2 = password2Input.value;
    const password3 = password3Input.value;

    if (password2 === password3 && password3 === password2) {
        console.log('Passwords are equal and valid.');
        password2Input.classList.remove('error_password');
        password3Input.classList.remove('error_password');
        password2Input.classList.add('valid_password');
        password3Input.classList.add('valid_password');
    } else {
        console.log('Passwords are not equal.');
        password2Input.classList.add('error_password');
        password3Input.classList.add('error_password');
        password2Input.classList.remove('valid_password');
        password3Input.classList.remove('valid_password');
    }
}