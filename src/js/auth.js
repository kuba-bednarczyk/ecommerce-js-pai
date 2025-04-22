import {getUser} from './utils.js';

const loginSection = document.querySelector('#login-section');
const registerSection = document.querySelector('#register-section');

const goToLogin = document.querySelector('#goToLogin');
const goToRegister = document.querySelector('#goToRegister');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

const checkIfLoggedIn = () => {
  const user = getUser();
  if (user && user.loggedIn) {
    window.location.href = './account.html';
  }
}

document.addEventListener('DOMContentLoaded', () => checkIfLoggedIn)

const switchLoginRegister = () => {
  if (loginSection.classList.contains('d-none')) {
    loginSection.classList.remove('d-none');
    registerSection.classList.add('d-none');
  } else {
    registerSection.classList.remove('d-none');
    loginSection.classList.add('d-none');
  }
};

goToLogin.addEventListener('click', switchLoginRegister);
goToRegister.addEventListener('click', switchLoginRegister);

// Register form validation
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const username = document.getElementById('reg-username');
  const email = document.getElementById('reg-email');
  const password = document.getElementById('reg-password');
  const confirmPassword = document.getElementById('confirm-password');

  let isValid = true;

  // test email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.classList.add('is-invalid');
    isValid = false;
  } else {
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
  }

  // test password
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password.value.trim())) {
    password.classList.remove('is-invalid');
    password.classList.add('is-valid');
  } else {
    password.classList.remove('is-valid');
    password.classList.add('is-invalid');
    isValid = false;
  }

  if (password.value.trim() !== confirmPassword.value.trim()) {
    confirmPassword.classList.add('is-invalid');
    isValid = false;
  } else {
    confirmPassword.classList.remove('is-invalid');
    confirmPassword.classList.add('is-valid');
  }

  if (isValid) {
    const userData = {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      shippingData: {},
      loggedIn: true,
    };
    localStorage.setItem('user', JSON.stringify(userData));

    alert('Konto zostało pomyślnie utworzone!');
    window.location.href = './account.html';
  }
});


// login validation
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const username = document.getElementById('username');
  const password = document.getElementById('password');

  const user = getUser();

  let isValid = true;

  //test username
  if (!user || user.username !== username.value.trim()) {
    username.classList.add('is-invalid');
    username.classList.remove('is-valid');
    isValid = false;
  } else {
    username.classList.remove('is-invalid');
    username.classList.add('is-valid');
  }

    //test password
    if (!user || user.password !== password.value.trim()) {
      password.classList.add('is-invalid');
      password.classList.remove('is-valid');
      isValid = false;
    } else {
      password.classList.remove('is-invalid');
      password.classList.add('is-valid');
    }

    if (isValid) {
      user.loggedIn = true;
      localStorage.setItem('user', JSON.stringify(user));

      alert('Zalogowano pomyślnie!');
      window.location.href = './account.html';
    }
});

