const password1Input = document.querySelector('.js-password1');
const password2Input = document.querySelector('.js-password2');

// Add input event listeners to all three password fields
password1Input.addEventListener('input', validatePasswords);
password2Input.addEventListener('input', validatePasswords);

function validatePasswords() {
    const password1 = password1Input.value;
    const password2 = password2Input.value;

    if (password1 === password2) {
        console.log('Passwords are equal and valid.');
        password1Input.style.border = '2px solid #33A421'
        password2Input.style.border = '2px solid #33A421'
    } else {
        console.log('Passwords are not equal.');
        password1Input.style.border = '1px solid #D94E4E'
        password2Input.style.border = '1px solid #D94E4E'
    }
}