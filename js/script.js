/////////////////
// DOM Selector

const billAmt = document.querySelector('.amt');
const totalPeople = document.querySelector('.people');
const displayTotalAmt = document.querySelector('.total-amt');
const displayTotalTip = document.querySelector('.tip-amt');

const inputBox = Array.from(document.querySelectorAll('.input__box'));

const amtLabel = document.querySelector('.amt--label');
const peopleLabel = document.querySelector('.people--label');
const custLabel = document.querySelector('.custom--label');

const form = document.querySelector('.bill__form');
const formCustom = document.querySelector('.form__custom');
const formTips = document.querySelector('.form__tips');
const formBtns = document.querySelectorAll('.btn--form');

const resetBtn = document.querySelector('.btn--reset');

////////////////
// variables

const numberRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/; //NUMBER VALIDATION

const classArr = ['wrong__format', 'correct__format'];
let totalPerPerson = 0;
let tipPerPerson = 0;
let tip = 0;
let evt;

///////////////
// Methods

// Validate Inputs
const validator = function (num, lbl, val, e) {
  evt = e.target.closest('.input__box');
  evt.classList.remove(...classArr);

  if (num) {
    if (Number(val.value) <= 0) {
      evt.classList.add('wrong__format');
      lbl.style = 'visibility: visible';
      lbl.textContent = "Can't be zero or less";
      resetBtn.disabled = true;
    } else {
      evt.classList.add('correct__format');
      lbl.style = 'visibility: hidden';
      calculator(Number(billAmt.value), Number(totalPeople.value));
    }
  } else {
    evt.classList.add('wrong__format');
    lbl.style = 'visibility: visible';
    lbl.textContent = 'Not a Number';
    resetBtn.disabled = true;
  }
};

// calulate Bill
const calculator = (bill, person) => {
  if (person > 0) {
    tipPerPerson = (bill * (tip / 100)) / person;
    totalPerPerson = bill / person + tipPerPerson;

    display(Math.abs(tipPerPerson), totalPerPerson);

    resetBtn.disabled = false;
  }
};

// display Bill
const display = (tip, bill) => {
  displayTotalTip.textContent = formatter(tip);
  displayTotalAmt.textContent = formatter(bill);
};

// format Values
const formatter = (val) => {
  return new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
    currencySign: 'accounting',
  }).format(val);
};

// reset Everything
const reset = () => {
  totalPerPerson = 0;
  tipPerPerson = 0;
  billAmt.value = '';
  totalPeople.value = '';
  formCustom.value = '';
  resetBtn.disabled = true;
  displayTotalAmt.textContent = '$0.00';
  displayTotalTip.textContent = '$0.00';
  formBtns.forEach((btn) => btn.classList.remove('active'));
  inputBox.forEach((box) => box.classList.remove(...classArr));
};

//////////////////
//Event Handler

// form tip selector
formTips.addEventListener('click', (e) => {
  const clicked = e.target.closest('.btn--form');

  if (!clicked) return;

  formBtns.forEach((btn) => btn.classList.remove('active'));

  clicked.classList.add('active');
  formCustom.value = '';
  tip = parseInt(clicked.textContent);

  calculator(Number(billAmt.value), Number(totalPeople.value));
});

// custom tip
formCustom.addEventListener('input', (e) => {
  e.preventDefault();

  formBtns.forEach((btn) => btn.classList.remove('active'));

  const inputNum = numberRegex.test(formCustom.value);

  tip = Number(formCustom.value) < 0 ? 0 : Number(formCustom.value);
  validator(inputNum, custLabel, formCustom, e);

  calculator(Number(billAmt.value), Number(totalPeople.value));
});

// bill input
billAmt.addEventListener('input', (e) => {
  e.preventDefault();
  const inputNum = numberRegex.test(billAmt.value);

  validator(inputNum, amtLabel, billAmt, e);
});

// people input
totalPeople.addEventListener('input', (e) => {
  e.preventDefault();
  const inputNum = numberRegex.test(totalPeople.value);

  validator(inputNum, peopleLabel, totalPeople, e);
});

resetBtn.addEventListener('click', reset);
