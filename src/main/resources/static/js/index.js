const env = 'http://localhost:8080';
// const env = 'https://cryptocurrency-exchanger.herokuapp.com';
// const env = 'https://hungry-swap.com';
$('.form_exchange').find('input').attr('autocomplete', 'off');

//top dropdown elements
const dropdownTop = document.querySelector('.js-top-dropdown');
const headerDropdownTop = document.querySelectorAll('.js-top-dropdown-header');
console.log('headerDropdownTop', headerDropdownTop);
const dropdownOptionTop = document.querySelectorAll('.js-top-dropdown-option');
const coinNameHeaderTop = document.querySelector('.js-top-dropdown-title');
const mainCoinImgTop = document.querySelectorAll('.js-top-main-coin-image');
console.log('mainCoinImgTop', mainCoinImgTop);
const mainCoinAbbrTop = document.querySelector('.js-top-main-coin-abbr');
const topInput = document.querySelectorAll('.js-top-input');
console.log('topInput', topInput);
// elements for min and max amounts of coins for top dropdown
const minCoinAmount = document.querySelectorAll('.js-min-coins-amount');
// console.log('minCoinAmount', minCoinAmount);
const maxCoinAmount = document.querySelectorAll('.js-max-coins-amount');

//bottom dropdown elements
const headerDropdownBottom = document.querySelectorAll('.js-bottom-dropdown-header');
console.log('headerDropdownBottom', headerDropdownBottom);
const dropdownBottom = document.querySelector('.js-bottom-dropdown');
const dropdownOptionBottom = document.querySelectorAll('.js-bottom-dropdown-option');
const coinNameHeaderBottom = document.querySelector('.js-bottom-dropdown-title');
const mainCoinImgBottom = document.querySelectorAll('.js-bottom-main-coin-image');
const mainCoinAbbrBottom = document.querySelector('.js-bottom-main-coin-abbr');
const bottomInput = document.querySelectorAll('.js-bottom-input');
console.log('bottomInput', bottomInput);

const btnStartExchange = document.querySelector('.js-start-exchange');
const inputsForCheckingEmptyFields = document.querySelectorAll('.js-input-for-check');
let btnChoose = document.querySelector('.js-btn-modal-window-choose');
const arrowTop = document.querySelector('.js-arrow_top');
const arrowBottom = document.querySelector('.js-arrow_bottom');

console.log('dropdownOptionBottom', dropdownOptionBottom);
dropdownOptionBottom.forEach((el) => {
    console.log('el', el);
})


// //rate element in bottom dropdown
// const rateElement = document.querySelector('.js-rate');
// console.log('rateElement', rateElement);

// const hiddenInputRateElement = document.querySelector('.js-hidden-input-rate');

//buttons exchange in shortcuts
const buttonsExchangeShortcut = document.querySelectorAll('.js-shortcut-btn-exchange');

/////
const testInputTop = document.querySelector('.js-hidden_input-top');
const testInputBottom = document.querySelector('.js-hidden_input-bottom');
/////

const removeItemFromDropdown = (dropdown, coinName) => {
    dropdown.forEach((option) => {
        option.classList.remove('hidden');
        if(option.querySelector('[data-coin-name]').textContent === coinName) {
            option.classList.add('hidden');
        }
    })
}

const setCoinInHeader = (option, imgHeader, coinNameHeader, coinAbbrHeader, testInput) => {
    // topInput.value = '';
    topInput.forEach((input) => {
        input.value = '';
    })
    // bottomInput.value = '';
    bottomInput.forEach((input) => {
        input.value = '';
    })
    const coinName = option.querySelector('[data-coin-name]').textContent;
    const coinAbbr = option.querySelector('[data-coin-abbr]').textContent;
    const coinSrcImg = option.querySelector('[data-coin-img]').getAttribute('src');

    // imgHeader.setAttribute('src', `${coinSrcImg}`);

    imgHeader.forEach((img) => {
        img.setAttribute('src', `${coinSrcImg}`);
    })

    coinNameHeader.textContent = coinName;
    coinAbbrHeader.textContent = coinAbbr;

    return coinAbbr;
}

//get course and set in rate element
// const getCourse = async (firstSymbol, secondSymbol) => {
//     const response = await fetch(`${env}/api/app/get/price/?firstSymbol=${firstSymbol}&secondSymbol=${secondSymbol}`);
//     const data = await response.json();
//     // rateElement.textContent = `1 ${firstSymbol} - ${data} ${secondSymbol}`;
//     // hiddenInputRateElement.value = `1 ${firstSymbol} - ${data} ${secondSymbol}`;
// }
//get min and max amount of coins and set them to appropriate element
let minCoinAmountNumber;
let maxCoinAmountNumber;
const getMinAndMaxAmountOfCoins = async (coinAbbr) => {
    const responseMinAmount = await fetch(`${env}/api/coin/min/amount/?symbol=${coinAbbr}`);
    const dataMinAmount = await responseMinAmount.json();
    console.log('dataMinAmount', dataMinAmount);
    minCoinAmountNumber = dataMinAmount;
    // minCoinAmount.textContent = `${dataMinAmount} ${coinAbbr}`;
    minCoinAmount.forEach((elMinCoinAmount) => {
        elMinCoinAmount.textContent = `${dataMinAmount} ${coinAbbr}`;
    })

    const responseMaxAmount = await fetch(`${env}/api/coin/max/amount/?symbol=${coinAbbr}`);
    const dataMaxAmount = await responseMaxAmount.json();
    maxCoinAmountNumber = dataMaxAmount;
    console.log('dataMaxAmount', dataMaxAmount);
    // maxCoinAmount.textContent = `${dataMaxAmount} ${coinAbbr}`;
    maxCoinAmount.forEach((elMaxCoinAmount) => {
        elMaxCoinAmount.textContent = `${dataMaxAmount} ${coinAbbr}`;
    })
}

testInputTop.value = mainCoinAbbrTop.textContent;
testInputBottom.value = mainCoinAbbrBottom.textContent;

removeItemFromDropdown(dropdownOptionBottom, coinNameHeaderTop.textContent);
removeItemFromDropdown(dropdownOptionTop, coinNameHeaderBottom.textContent);

// getCourse(mainCoinAbbrTop.textContent, mainCoinAbbrBottom.textContent);
getMinAndMaxAmountOfCoins(mainCoinAbbrTop.textContent);
const footerMinMaxElements = document.querySelectorAll('.js-dropdown-footer-min-max');
topInput.forEach((input) => {
    input.addEventListener('input', async () => {


        // if (input.value !== '') {
            const response = await fetch(`${env}/api/app/get/taken/?amount=${+input.value}&firstSymbol=${mainCoinAbbrTop.textContent}&secondSymbol=${mainCoinAbbrBottom.textContent}`);
            const data = await response.json();
            console.log('data from topInput', input.value);
            console.log('data top', data);
            console.log('minCoinAmountNumber', minCoinAmountNumber);
            console.log('input', input);
            if(+input.value < minCoinAmountNumber || +input.value > maxCoinAmountNumber) {
                console.log('enetr in if minCoinAmountNumber');
                input.style.backgroundColor = '#D94E4E';
                input.style.color = 'white';
                btnChoose.style.color = 'rgba(255, 255, 255, 0.40)';
                btnChoose.disabled = 'true';
                footerMinMaxElements.forEach((item) => {
                    item.style.color = '#D94E4E';
                })
                btnStartExchange.disabled = 'true';
                bottomInput.forEach((input) => {
                    input.value = '';
                })
            } else {
                topInput[0].style.backgroundColor = 'white';
                topInput[1].style.backgroundColor = '#B5FF57';
                input.style.color = '#252525';
                btnChoose.style.color = '#FFF';
                btnChoose.removeAttribute('disabled');
                footerMinMaxElements.forEach((item) => {
                    item.style.color = '#121212';
                })
                btnStartExchange.removeAttribute('disabled');
                bottomInput.forEach((input) => {
                    input.value = data;
                })
            }


            // bottomInput.value = data;

            // bottomInput.forEach((input) => {
            //     input.value = data;
            // })
            // if (input.value === '') {
            //     // bottomInput.value = '';
            //     bottomInput.forEach((input) => {
            //         input.value = '';
            //     })
            // }


        // }
        // else {
        //
        //     console.log('enetr in test if');
        //     console.log('bootom input val = 0', input.value);
        //     // bottomInput.value = '';
        //     bottomInput.forEach((input) => {
        //         input.value = '';
        //     })
        // }


        // if(+input.value < minCoinAmountNumber) {
        //     input.style.backgroundColor = '#D94E4E';
        //     input.style.color = 'white';
        //     btnChoose.style.color = 'rgba(255, 255, 255, 0.40)';
        //     btnChoose.disabled = 'true';
        //     return
        // }
    });
})

bottomInput.forEach((input) => {
    input.addEventListener('input', async () => {
        // if (input.value !== '') {
            const response = await fetch(`${env}/api/app/get/given/?amount=${+input.value}&firstSymbol=${mainCoinAbbrBottom.textContent}&secondSymbol=${mainCoinAbbrTop.textContent}`);
            const data = await response.json();
            console.log('data from bottomInput', input.value);
            console.log('data bottom', data);
            console.log('(topInput[1].value', (topInput[1].value));

        if((data !== '') && (data < minCoinAmountNumber || data > maxCoinAmountNumber)) {
            console.log('enetr in if minCoinAmountNumber');
            topInput[1].style.backgroundColor = '#D94E4E';
            topInput[1].style.color = 'white';
            btnChoose.style.color = 'rgba(255, 255, 255, 0.40)';
            btnChoose.disabled = 'true';
            footerMinMaxElements.forEach((item) => {
                item.style.color = '#D94E4E';
            })
            btnStartExchange.disabled = 'true';
            topInput.forEach((input) => {
                input.value = '';
            })
        } else {
            topInput[0].style.backgroundColor = 'white';
            topInput[1].style.backgroundColor = '#B5FF57';
            topInput[1].style.color = '#252525';
            // topInput[1].style.color = '#252525';
            btnChoose.style.color = '#FFF';
            btnChoose.removeAttribute('disabled');
            footerMinMaxElements.forEach((item) => {
                item.style.color = '#121212';
            })
            btnStartExchange.removeAttribute('disabled');
            topInput.forEach((input) => {
                input.value = data;
            })
        }

            // topInput.forEach((input) => {
            //     input.value = data;
            // })
            // if (input.value === '') {
            //     topInput.forEach((input) => {
            //         input.value = '';
            //     })
            // }


        // } else {
        //     topInput.forEach((input) => {
        //         input.value = '';
        //     })
        // }
    })
})


dropdownOptionTop.forEach((option) => {
    option.addEventListener('click', () => {
        //find and set coin from option to header
        const currentCoinAbbr = setCoinInHeader(option, mainCoinImgTop, coinNameHeaderTop, mainCoinAbbrTop, testInputBottom);
        testInputTop.value = currentCoinAbbr;

        //removing item from other dropdown
        dropdownTop.classList.remove('opened');
        removeItemFromDropdown(dropdownOptionBottom, coinNameHeaderTop.textContent);

        //calculating course
        // getCourse(currentCoinAbbr, mainCoinAbbrBottom.textContent);

        //get and set min and max coins value
        getMinAndMaxAmountOfCoins(currentCoinAbbr);
        arrowTop.classList.remove('js-arrow-turned');
        btnChoose.style.display = 'block';
    });
})
const btnChooseMobile = document.querySelectorAll('.modal_window_btn_exchange_mobile');
headerDropdownTop.forEach((item) => {
    item.addEventListener('click', () => {
        console.log('headerDropdownTop click');
        arrowBottom.classList.remove('js-arrow-turned');
        dropdownBottom.classList.remove('opened');
        dropdownTop.classList.toggle('opened');
        arrowTop.classList.toggle('js-arrow-turned');

        if (dropdownTop.classList.contains('opened')) {
            btnChooseMobile.forEach((btn) => {
                btnChoose.style.display = 'none';
                btn.style.display = 'block';
            })

            // arrowTop.style.rotate = '180deg';
        } else {
            btnChooseMobile.forEach((btn) => {
                btnChoose.style.display = 'block';
                btn.style.display = 'none';
            })
            btnChoose.style.display = 'block';
            btnChooseMobile.style.display = 'none';
            // btnChoose.style.marginTop = '23px';

        }
    });


})

dropdownOptionBottom.forEach((option) => {
    option.addEventListener('click', () => {
        arrowBottom.classList.remove('js-arrow-turned');
        btnChoose.style.display = 'block';
        console.log('dropdownOptionBottom clicl', dropdownOptionBottom)

        //find and set coin from option to header
        const currentCoinAbbr = setCoinInHeader(option, mainCoinImgBottom, coinNameHeaderBottom, mainCoinAbbrBottom, testInputTop);
        testInputBottom.value = currentCoinAbbr;

        //removing item from dropdown
        dropdownBottom.classList.remove('opened');
        removeItemFromDropdown(dropdownOptionTop, coinNameHeaderBottom.textContent);

        //calculating course
        // getCourse(mainCoinAbbrTop.textContent, currentCoinAbbr);

        //get and set min and max coins value
        getMinAndMaxAmountOfCoins(mainCoinAbbrTop.textContent);

    });
})

headerDropdownBottom.forEach((item) => {
    item.addEventListener('click', () => {
        arrowTop.classList.remove('js-arrow-turned');
        dropdownTop.classList.remove('opened');
        dropdownBottom.classList.toggle('opened');
        arrowBottom.classList.toggle('js-arrow-turned');

        console.log('dropdownBottom.classList', dropdownBottom.classList);
        if (dropdownBottom.classList.contains('opened')) {
            // btnChoose.style.marginTop = '480px'
            btnChooseMobile.forEach((btn) => {
                btnChoose.style.display = 'none';
                btn.style.display = 'block';
            })
        } else {
            // btnChoose.style.marginTop = '23px'
            btnChooseMobile.forEach((btn) => {
                btnChoose.style.display = 'block';
                btn.style.display = 'none';
            })

        }
    });


})

buttonsExchangeShortcut.forEach((button) => {

    button.addEventListener('click', (event) => {
        // event.preventDefault();
        const coinAbbrFrom = button.getAttribute('data-shortcut-from');
        const coinAbbrTo = button.getAttribute('data-shortcut-to');

        const currentItem = button.closest('.js-shortcut_item');

        const coinImgSrcFrom = currentItem.querySelector('.js-coin-from').getAttribute('src');
        const coinImgSrcTo = currentItem.querySelector('.js-coin-to').getAttribute('src');
        const coinNameFrom = currentItem.querySelector('.js-money-from').textContent;
        const coinNameTo = currentItem.querySelector('.js-money-to').textContent;

        //set for dropdown header value

        testInputTop.value = coinAbbrFrom;
        testInputBottom.value = coinAbbrTo;

        coinNameHeaderTop.textContent = coinNameFrom;
        coinNameHeaderBottom.textContent = coinNameTo;

        // mainCoinImgTop.src = coinImgSrcFrom;
        mainCoinImgTop.forEach((img) => {
            img.src = coinImgSrcFrom;
        })
        // mainCoinImgBottom.src = coinImgSrcTo;
        mainCoinImgBottom.forEach((img) => {
            img.src = coinImgSrcTo;
        })


        mainCoinAbbrTop.textContent = coinAbbrFrom;
        mainCoinAbbrBottom.textContent = coinAbbrTo;

        // removing from dropdowns selected options
        removeItemFromDropdown(dropdownOptionTop, coinNameTo);
        removeItemFromDropdown(dropdownOptionBottom, coinNameFrom);

        //get course
        // getCourse(coinAbbrFrom, coinAbbrTo);

        //get and set min and max coins value
        getMinAndMaxAmountOfCoins(coinAbbrFrom);

        // topInput.value = '';
        topInput.forEach((input) => {
            input.value = '';
        })
        bottomInput.forEach((input) => {
            input.value = '';
        })
        // bottomInput.value = '';
    })
});



// search 1 input
inputSearch1 = document.getElementById('myInput');
inputSearch1.addEventListener('input', () => {
    let  filter, txtValue;
    filter = inputSearch1.value.toUpperCase();
    let topDropdownOptions = document.querySelectorAll('.js-top-dropdown-option');
    for (let i = 0; i < topDropdownOptions.length; i++) {
        let elementWithValue = topDropdownOptions[i].querySelector('.dropdown_coin_name');
        txtValue = elementWithValue.textContent || elementWithValue.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            topDropdownOptions[i].style.display = "";
        } else {
            topDropdownOptions[i].style.display = "none";
        }
    }
})
// search 2 input
inputSearch2 = document.getElementById('myInput1');
inputSearch2.addEventListener('input', () => {
    let  filter, txtValue;
    filter = inputSearch2.value.toUpperCase();
    let bottomDropdownOptions = document.querySelectorAll('.js-bottom-dropdown-option');
    for (let i = 0; i < bottomDropdownOptions.length; i++) {
        let elementWithValue = bottomDropdownOptions[i].querySelector('.dropdown_coin_name');
        txtValue = elementWithValue.textContent || elementWithValue.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bottomDropdownOptions[i].style.display = "";
        } else {
            bottomDropdownOptions[i].style.display = "none";
        }
    }
})

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btns = document.querySelectorAll('.js-btn-open-modal');

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
const headerMobile = document.querySelector('.js-header-mobile-wrapper');
// When the user clicks on the button, open the modal
btns.forEach((btn) => {
    btn.onclick = function(e) {
        e.preventDefault();
        modal.style.display = "block";
        topInput[1].value = topInput[0].value;

        console.log('topInput[0].value', topInput[0].value);
        console.log('topInput[1].value', topInput[1].value);
        console.log('click');
        console.log('headerMobile', headerMobile)
        headerMobile.style.backgroundColor = 'transparent';
    }

})


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";

    let currentInput = modal.querySelector('.js-top-input');
    console.log(currentInput, currentInput.value)

    topInput[0].value = currentInput.value;
    topInput[0].style.color = 'black';
    console.log('currentInput.value', currentInput.value);
    console.log('+(currentInput.value)', +(currentInput.value));
    console.log('minCoinAmountNumber', minCoinAmountNumber);
    console.log('maxCoinAmountNumber', maxCoinAmountNumber);
    console.log('+(currentInput.value) < minCoinAmountNumber', +(currentInput.value) < minCoinAmountNumber);
    console.log(' +(currentInput.value) > maxCoinAmountNumber',  +(currentInput.value) > maxCoinAmountNumber);
    headerMobile.style.backgroundColor = '#0D0D0D';
    if (+(currentInput.value) < minCoinAmountNumber || +(currentInput.value) > maxCoinAmountNumber) {
        topInput[0].value = '';
        console.log('enter in tf close')
        // topInput[1].style.backgroundColor = '#D94E4E';
        // topInput[1].style.color = 'white';
        // btnChoose.style.color = 'rgba(255, 255, 255, 0.40)';
        // btnChoose.disabled = 'true';
    }
    if (inputsForCheckingEmptyFields[0].value === '' || inputsForCheckingEmptyFields[1].value === '' || inputsForCheckingEmptyFields[2].value === '' || inputsForCheckingEmptyFields[3].value === '') {
        console.log('are empty');
        btnStartExchange.disabled = 'true';
    } else {
        console.log('no empty');
        btnStartExchange.removeAttribute('disabled');

    }
}
btnChoose.onclick = function(e) {
    e.preventDefault();
    modal.style.display = "none";

    let currentInput = modal.querySelector('.js-top-input');
    console.log(currentInput, currentInput.value)

    topInput[0].value = currentInput.value;
    topInput[0].style.color = 'black';
    headerMobile.style.backgroundColor = '#0D0D0D';


    if (inputsForCheckingEmptyFields[0].value === '' || inputsForCheckingEmptyFields[1].value === '' || inputsForCheckingEmptyFields[2].value === '' || inputsForCheckingEmptyFields[3].value === '') {
        console.log('are empty');
        btnStartExchange.disabled = 'true';
    } else {
        console.log('no empty');
        btnStartExchange.removeAttribute('disabled');

    }



    // if (+topInput[1].value < minCoinAmountNumber && +topInput[1].value > maxCoinAmountNumber) {
    //     topInput[0].value = '';
    //     console.log('enter in tf close')
    //     // topInput[1].style.backgroundColor = '#D94E4E';
    //     // topInput[1].style.color = 'white';
    //     // btnChoose.style.color = 'rgba(255, 255, 255, 0.40)';
    //     // btnChoose.disabled = 'true';
    // }

}
console.log('inputsForCheckingEmptyFields', inputsForCheckingEmptyFields)
inputsForCheckingEmptyFields.forEach((input) => {
    input.addEventListener('input', () => {

        if (inputsForCheckingEmptyFields[0].value === '' || inputsForCheckingEmptyFields[1].value === '' || inputsForCheckingEmptyFields[2].value === '' || inputsForCheckingEmptyFields[3].value === '') {
            console.log('are empty');
            btnStartExchange.disabled = 'true';
        } else {
            console.log('no empty');
            btnStartExchange.removeAttribute('disabled');

        }
    })
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        headerMobile.style.backgroundColor = '#0D0D0D';
    }

}