const allBtnsDown = document.querySelectorAll('.js-down');
const allBtnsUp = document.querySelectorAll('.js-up');

allBtnsDown.forEach((btn) => {
    btn.addEventListener('click', () => {
        btnParent = btn.closest(".history_item");
        const btnUp = btnParent.querySelector('.js-up');
        btnUp.style.display = 'block';
        btn.style.display = 'none';
        const blockInfo = btnParent.nextElementSibling;
        blockInfo.classList.remove('history_item_info_hidden');
    })
})
allBtnsUp.forEach((btn) => {
    btn.addEventListener('click', () => {
        btnParent = btn.closest(".history_item");
        const btnDown = btnParent.querySelector('.js-down');
        btnDown.style.display = 'block';
        btn.style.display = 'none';
        const blockInfo = btnParent.nextElementSibling;
        blockInfo.classList.add('history_item_info_hidden');
    })
})