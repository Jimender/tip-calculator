/////////////////
// DOM Selector

//inputs
const billInput = document.querySelector('.amt');
const tipInput = document.querySelector('.form__custom');
const peopleInput = document.querySelector('.people');

//error message
const errorAmt = document.querySelector('.amt--label');
const errorTip = document.querySelector('.custom--label');
const errorPeople = document.querySelector('.people--label');

//buttons
const tipBtns = document.querySelectorAll('.btn--form');
const resetBtn = document.querySelector('.btn--reset');

//form
const formTips = document.querySelector('.form__tips');

//display
const displayTip = document.querySelector('.tip-amt');
const displayTotal = document.querySelector('.total-amt');

//variables
const numberRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/; //NUMBER VALIDATION
let labels = [errorAmt, errorTip, errorPeople];
let inputs = [billInput, tipInput, peopleInput];
let formatArr = ['wrong__format', 'correct__format'];

//object
const obj = {
  billAmt: 0,
  tipRate: 0,
  noPeople: 1,
  totalBill: 0,
  totalTip: 0,

  reset() {
    this.billAmt = 0;
    this.tipRate = 0;
    this.noPeople = 1;
    this.totalBill = 0;
    this.totalTip = 0;
  },
};

////////////
// Methods

//Toggle Visibility

const toggleBorder = (field, frmt) => {
  field.closest('.input__box').classList.remove(...formatArr);
  if (!frmt === 'none') return;
  field.closest('.input__box').classList.add(`${frmt}`);
};

const toggleMssg = (lbl, txt = 'none', vis = 'hidden') => {
  lbl.style = `visibility: ${vis}`;
  lbl.innerHTML = `${txt}`;
};

// validate Values
const validator = (errorMsg, input, amt) => {
  const val = parseFloat(input.value);

  if (!numberRegex.test(val)) {
    toggleMssg(errorMsg, 'Not a Number', 'visible');
    toggleBorder(input, 'wrong__format');
    return;
  }

  if (val <= 0) {
    toggleMssg(errorMsg, "Can't be zero or less", 'visible');
    toggleBorder(input, 'wrong__format');
    return;
  } else {
    if (val > input.max) {
      toggleMssg(errorMsg, 'Max Value Exceeded', 'visible');
      toggleBorder(input, 'wrong__format');
    } else {
      obj[`${amt}`] = val;
      toggleMssg(errorMsg);
      toggleBorder(input, 'correct__format');
      calculateBill();
    }
  }
};

//bill
const billMethod = () => {
  validator(errorAmt, billInput, 'billAmt');
};

//tip
const tipMethod = () => {
  validator(errorTip, tipInput, 'tipRate');
};

//people
const peopleMethod = () => {
  validator(errorPeople, peopleInput, 'noPeople');
  resetBtn.disabled = false;
};

// select from btn or custom value
const selectTip = (e) => {
  const clicked = e.target.closest('.btn--form');

  tipBtns.forEach((btn) => {
    btn.classList.remove('active');
  });

  if (e.target.classList.contains('form__custom')) return;
  if (!clicked) return;

  clicked.classList.add('active');

  obj.tipRate = parseInt(clicked.textContent);

  toggleBorder(tipInput, 'none');
  toggleMssg(errorTip);
  calculateBill();
};

//calculate total
const calculateBill = () => {
  obj.totalTip = (obj.billAmt * obj.tipRate) / 100;
  obj.totalBill = obj.billAmt + obj.totalTip;
  displayBill();
};

// formatter
const formatter = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencySign: 'accounting',
    maximumFractionDigits: 2,
  }).format(val);
};

//display bills
const displayBill = () => {
  displayTip.value = formatter(obj.totalTip / obj.noPeople);
  displayTotal.value = formatter(obj.totalBill / obj.noPeople);
};

const resetAll = () => {
  obj.reset();
  inputs.forEach((input) => {
    input.value = '';
    toggleBorder(input);
  });
  labels.forEach((lbl) => {
    toggleMssg(lbl);
  });
  tipBtns.forEach((btn) => {
    btn.classList.remove('active');
  });
  displayTip.value = '$0.00';
  displayTotal.value = '$0.00';
  resetBtn.disabled = true;
};

///////////////////
// Event Handlers

billInput.addEventListener('input', billMethod);
tipInput.addEventListener('input', tipMethod);
peopleInput.addEventListener('input', peopleMethod);

formTips.addEventListener('click', selectTip);

resetBtn.addEventListener('click', resetAll);
