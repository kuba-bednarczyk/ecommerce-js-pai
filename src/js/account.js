import { getUser } from "./utils.js";

// regexp do walidacji pól formularza:
const accountValidations = [
  {
    id: 'email',
    regex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    errorMessage: 'Wpisz poprawny adres email.',
  },
  {
    id: 'password',
    regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/,
    errorMessage: 'Hasło musi mieć co najmniej 8 znaków, w tym 1 dużą literę, 1 małą literę i 1 cyfrę.',
  },
  {
    id: 'firstName',
    regex: /^\p{Lu}[\p{L}'’\- ]+$/u, 
    errorMessage: 'Imię musi zaczynać się z wielkiej litery i mieć min. 2 znaki.'
  },
  {
    id: 'lastName',
    regex: /^\p{Lu}[\p{L}'’\- ]+$/u, 
    errorMessage: 'Nazwisko musi zaczynać się z wielkiej litery.'
  },
  {
    id: 'delivery-email',
    regex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    errorMessage: 'Wpisz poprawny adres email.'
  },
  {
    id: 'phone',
    regex: /^\d{3}\s?\d{3}\s?\d{3}$/,
    errorMessage: 'Wpisz poprawny numer telefonu.'
  },
  {
    id: 'postal-code',
    regex: /^\d{2}-\d{3}$/,
    errorMessage: 'Wpisz poprawny kod pocztowy (np. 20-001).'
  },
  {
    id: 'street',
    regex: /^\p{Lu}[\p{L}'’\- ]+$/u,
    errorMessage: 'Podaj poprawną nazwę ulicy (np. Wesoła)'
  },
  {
    id: 'house-number',
    regex: /^\d+[a-zA-Z]?([\/\-]\d+[a-zA-Z]?)?$/,
    errorMessage: 'Podaj poprawny numer domu/mieszkania (np. 34/5)'
  },
  {
    id: 'city',
    regex: /^\p{Lu}[\p{L}'’\- ]+$/u, 
    errorMessage: 'Miejscowość musi zaczynać się z wielkiej litery.'
  }
];

const attachLiveValidationListeners = () => {
  accountValidations.forEach(item => {
    const input = document.getElementById(item.id);
    if (!input) return;
    input.addEventListener('input', () => {
      if (!item.regex.test(input.value.trim())) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setCustomValidity(item.errorMessage);
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setCustomValidity('');
      }
    });
  });
};

const handleFormValidation = () => {
  let allValid = true;

  accountValidations.forEach(item => {
    const input = document.getElementById(item.id);
    if (!input) return;

    const requiredFields = ["username", "email", "password"];

    //wyjatki: username, email, password nie moaga byc puste
    if (requiredFields.includes(item.id) && input.value.trim() === "") {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      input.setCustomValidity("To pole jest wymagane");
      allValid = false;
      return;
    }

    // traktuj pozsotale puste pola jako poprawne 
    if (!requiredFields.includes(item.id) && input.value.trim() === "") {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
      input.setCustomValidity("");
      return;
    }

    // walidacja pol na podstawie regex
    if (!item.regex.test(input.value.trim())) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.setCustomValidity(item.errorMessage);
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.setCustomValidity('');
    }
  });

  return allValid;
}


document.addEventListener("DOMContentLoaded", () => {
  let user = getUser();


  if (user) {
    const welocomeHeader = document.getElementById('welcome-header');
    welocomeHeader.textContent = `Witaj ${user.username}!`;

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    //dane uzytkownika w formularzu
    if (usernameInput) usernameInput.value = user.username || "";
    if (emailInput) emailInput.value = user.email || "";
    if (passwordInput) passwordInput.value = user.password || "";

    //dane dostawy w formularzu
    if (user.shippingData) {
      const shippingData = user.shippingData;

      document.getElementById("firstName").value = shippingData.firstName || "";
      document.getElementById("lastName").value = shippingData.lastName || "";
      document.getElementById("delivery-email").value = shippingData.email || "";
      document.getElementById("phone").value = shippingData.phone || "";
      document.getElementById("street").value = shippingData.street || "";
      document.getElementById("house-number").value = shippingData.houseNumber || "";
      document.getElementById("city").value = shippingData.city || "";
      document.getElementById("postal-code").value = shippingData.postalCode || "";
      document.getElementById("country").value = shippingData.country || "";
    }
  }

  attachLiveValidationListeners();

  // walidacja formularza po zapisaniu danych
  const accountForm = document.getElementById("account-form");
  if (accountForm) {
    accountForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isValid = handleFormValidation();
      accountForm.classList.add('was-validated');

      if (isValid) {
        const updatedUser = {
          username: document.getElementById("username").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("password").value.trim(),
          shippingData: {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("delivery-email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            street: document.getElementById("street").value.trim(),
            houseNumber: document.getElementById("house-number").value.trim(),
            city: document.getElementById("city").value.trim(),
            postalCode: document.getElementById("postal-code").value.trim(),
            country: document.getElementById("country").value,
          },
          loggedIn: true, 
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        // update nazwy uzytkownika w UI
        document.getElementById('account-btn').textContent = updatedUser.username;
        document.getElementById('welcome-header').textContent = `Witaj ${updatedUser.username}!`;
        
        alert("Dane zostały zapisane!");
      }

    });
  }

  //wylogowanie
  const logoutBtn = document.getElementById("logout-btn");

  user = getUser();
  logoutBtn.addEventListener("click", () => {
    if (user && user.loggedIn) {
      user.loggedIn = false;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem('order');
      localStorage.removeItem('cart');

      alert("Wylogowano pomyślnie!");
      window.location.href = "./index.html";
    }
  });

  // usuwanie konta
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  deleteAccountBtn.addEventListener("click", () => {
    if (user && user.loggedIn) {
      localStorage.removeItem('user');

      alert("Usunięto twoje konto");
      window.location.href = "./index.html";
    }
  });

});