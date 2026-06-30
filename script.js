const display = document.getElementById('display');
let currentValue = '0';
let expression = '';
let justEvaluated = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function clearAll() {
  currentValue = '0';
  expression = '';
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }

  if (currentValue.length <= 1) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

function appendNumber(value) {
  if (justEvaluated) {
    currentValue = '0';
    justEvaluated = false;
  }

  if (value === '.' && currentValue.includes('.')) {
    return;
  }

  if (currentValue === '0' && value !== '.') {
    currentValue = value;
  } else {
    currentValue += value;
  }

  updateDisplay();
}

function applyOperator(operator) {
  if (expression === '') {
    expression = `${currentValue}${operator}`;
  } else {
    expression = `${expression}${currentValue}${operator}`;
  }

  currentValue = '0';
  justEvaluated = false;
  updateDisplay();
}

function evaluateExpression() {
  if (expression === '') {
    return;
  }

  const fullExpression = `${expression}${currentValue}`;
  const sanitized = fullExpression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/%/g, '/100');

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    currentValue = Number.isFinite(result) ? String(result) : 'Error';
    expression = '';
    justEvaluated = true;
    updateDisplay();
  } catch (error) {
    currentValue = 'Error';
    expression = '';
    justEvaluated = true;
    updateDisplay();
  }
}

function applyFunction(func) {
  const number = Number(currentValue);
  let result = 0;

  switch (func) {
    case 'sqrt':
      result = Math.sqrt(number);
      break;
    case 'sqr':
      result = number * number;
      break;
    case 'sin':
      result = Math.sin((number * Math.PI) / 180);
      break;
    case 'cos':
      result = Math.cos((number * Math.PI) / 180);
      break;
    case 'tan':
      result = Math.tan((number * Math.PI) / 180);
      break;
    default:
      result = number;
  }

  currentValue = Number.isFinite(result) ? String(result) : 'Error';
  expression = '';
  justEvaluated = true;
  updateDisplay();
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const func = button.dataset.func;
  const value = button.dataset.value;

  if (action === 'clear') {
    clearAll();
    return;
  }

  if (action === 'delete') {
    deleteLast();
    return;
  }

  if (action === 'equals') {
    evaluateExpression();
    return;
  }

  if (func) {
    applyFunction(func);
    return;
  }

  if (value) {
    if (['+', '-', '*', '/', '%'].includes(value)) {
      applyOperator(value);
    } else {
      appendNumber(value);
    }
  }
}

document.querySelector('.buttons-grid').addEventListener('click', handleButtonClick);
updateDisplay();
