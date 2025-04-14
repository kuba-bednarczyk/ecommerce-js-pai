document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    localStorage.setItem('user', JSON.stringify({ username }));
    window.location.href = 'konto.html';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const btn = document.querySelector('a.btn.btn-outline-light');

  if (user && user.username && btn.innerText.includes('Konto')) {
    btn.innerHTML = `<i class="bi-person"></i> ${user.username}`;
    btn.href = 'konto.html';
  } else {
    btn.href = 'login.html';
  }
}); 