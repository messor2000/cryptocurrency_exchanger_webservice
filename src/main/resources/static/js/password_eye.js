const closedEyes = document.querySelectorAll('.js-closed-eye');
console.log('closedEyes', closedEyes);
closedEyes.forEach((eye) => {
    eye.addEventListener('click', () => {
        const prevSibling = eye.previousElementSibling;
        console.log('eye', eye);
        const nextSibling = eye.nextElementSibling;
        console.log('nextSibling', nextSibling)
        prevSibling.type = 'text';
        eye.style.display = 'none';
        nextSibling.style.display = 'block';
        console.log(eye);
        console.log('prevSibling', prevSibling);
    })
})

const openedEyes = document.querySelectorAll('.js-opened-eye');

openedEyes.forEach((eye) => {
    eye.addEventListener('click', () => {
        const prevSibling = eye.previousElementSibling;
        eye.style.display = 'none';
        prevSibling.style.display = 'block';
        const prevPrevSibling = prevSibling.previousElementSibling;
        prevPrevSibling.type = 'password';
    })
})