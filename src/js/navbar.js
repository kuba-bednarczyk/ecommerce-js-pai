import { getUser, updateCartCount } from "./utils.js";


document.addEventListener('DOMContentLoaded', () => {
  const accountBtn = document.getElementById('account-btn');
  const user = getUser();

  if (user && user.loggedIn) {
    // Jeśli użytkownik jest zalogowany, pokaż nazwę użytkownika i zmień link
    accountBtn.textContent = user.username;
    accountBtn.href = './account.html';
  } else {
    // Jeśli użytkownik nie jest zalogowany, ustaw link do strony logowania/rejestracji
    accountBtn.textContent = 'Konto';
    accountBtn.href = './auth.html';
  }

  updateCartCount('cart-count');
});