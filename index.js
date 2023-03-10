const input = document.querySelector('.counter-input');
const form = document.querySelector('.form');
const firstName = form.querySelector('[name]');
const email = form.querySelector('#email');
const age = form.querySelector('#number');
const role = form.querySelector('[role]');
const comment = form.querySelector('.input-textarea');
const checkboxes = form.querySelectorAll('.input-checkbox');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addCounter();
});

function addCounter() {
  const value = parseInt(input.value);
  input.value = value + 1;
  firstName.value = '';
  email.value = '';
  age.value = '';
  comment.value = '';
  checkboxes.forEach(item => item.checked = false);
}