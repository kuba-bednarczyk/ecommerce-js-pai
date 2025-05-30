import { updateCartCount, getOrder, getUser } from './utils.js';


// obiekty potrzebne do walidacji formularza
const deliveryDataValidations = [
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
    id: 'email',
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

const ccValidations = [
  {
    id: 'cc-name',
    regex: /^(?=.{2,})\p{Lu}+(?:[ '\-]\p{Lu}+)*$/u,
    errorMessage: 'Wpisz poprawne dane na karcie'
  },
  {
    id: 'cc-number',
    regex: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
    errorMessage: 'Wpisz poprawny numer karty.'
  },
  {
    id: 'cc-cvc',
    regex: /^\d{3}$/,
    errorMessage: 'Wpisz poprawny kod CVC (3 cyfry).'
  },
  {
    id: 'cc-expiration',
    regex: /^(0[1-9]|1[0-2])\/\d{2}$/,
    errorMessage: 'Wpisz poprawną datę wygaśnięcia karty w formacie MM/YY.'
  }
];

const blikValidations = {
  id: 'blik-code',
  regex: /^\d{6}$/,
  errorMessage: 'Wpisz poprawny 6-cyfrowy kod Blik.'
};


// bierzaca walidacja formularza
const attachLiveValidationListeners = () => {
  [...deliveryDataValidations, ...ccValidations, blikValidations].forEach(item => {
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


// walidacja formularza
const handleFormValidation = () => {
  let allValid = true;

  [...deliveryDataValidations].forEach(item => {
    const input = document.getElementById(item.id);
    if (!item.regex.test(input.value.trim())) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.setCustomValidity(item.errorMessage);
      allValid = false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.setCustomValidity('');
    }
  });

  const paymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
  if (!paymentMethodRadio) return false;

  const paymentMethod = paymentMethodRadio.id;
  if (paymentMethod === 'credit-card') {
    ccValidations.forEach(item => {
      const input = document.getElementById(item.id);
      if (!item.regex.test(input.value.trim())) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setCustomValidity(item.errorMessage);
        allValid = false;
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setCustomValidity('');
      }
    });
  } else if (paymentMethod === 'blik') {
    const input = document.getElementById(blikValidations.id);
    if (!blikValidations.regex.test(input.value.trim())) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      input.setCustomValidity(blikValidations.errorMessage);
      allValid = false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.setCustomValidity('');
    }
  }

  const terms = document.getElementById('accept-terms');
  if (!terms.checked) {
    terms.classList.add('is-invalid');
    allValid = false;
  } else {
    terms.classList.remove('is-invalid');
  }

  return allValid;
};

// wyrenderowanie itemow z koszyka obok formularza
const renderCartItems = () => {
  const order = getOrder();
  const { products, totalPrice, shippingCost } = order;
  const productsListElement = document.getElementById('products-list');

  let htmlContent = '';
  products.forEach((item) => {
    htmlContent += `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">${item.title}</h6>
          <small class="text-body-secondary">ilość: ${item.quantity}</small>
        </div>
        <span class="text-body-secondary">
          ${(item.price * item.quantity).toFixed(2)} zł
        </span>
      </li>
    `;
  });

  htmlContent += `
    <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
      <div><h6 class="my-0">Koszt dostawy (kurier):</h6></div>
      <span>${shippingCost} zł</span>
    </li>
    <li class="list-group-item d-flex justify-content-between">
      <strong>Do zapłaty:</strong>
      <strong id="order-total">${totalPrice.toFixed(2)} zł</strong>
    </li>
  `;

  productsListElement.innerHTML = htmlContent;
};

// wybor metody platnosci w UI 
const updatePaymentMethodDisplay = (creditDiv, blikDiv) => {
  const creditRadio = document.getElementById('credit-card');
  const blikRadio = document.getElementById('blik');
  const onDeliveryRadio = document.getElementById('ondelivery');

  if (creditRadio.checked) {
    creditDiv.classList.remove('d-none');
    blikDiv.classList.add('d-none');
  } else if (blikRadio.checked) {
    creditDiv.classList.add('d-none');
    blikDiv.classList.remove('d-none');
  } else if (onDeliveryRadio.checked) {
    creditDiv.classList.add('d-none');
    blikDiv.classList.add('d-none');
  }
};



// nasluchiwanie na zaladowanie kontentu strony
document.addEventListener('DOMContentLoaded', () => {
  // wypelnienie formularza danymi konta jesli uzytkownik jest zalogowany
  const user = getUser();

  if (user && user.loggedIn && user.shippingData) {
    const shippingData = user.shippingData;

    document.getElementById("firstName").value = shippingData.firstName || "";
    document.getElementById("lastName").value = shippingData.lastName || "";
    document.getElementById("email").value = shippingData.email || "";
    document.getElementById("phone").value = shippingData.phone || "";
    document.getElementById("street").value = shippingData.street || "";
    document.getElementById("house-number").value = shippingData.houseNumber || "";
    document.getElementById("city").value = shippingData.city || "";
    document.getElementById("postal-code").value = shippingData.postalCode || "";
    document.getElementById("country").value = shippingData.country || "";
  }

  const order = localStorage.getItem('order');

  // jeśli nie ma obiektu order - wracamy na strone glowna
  if (!order) {
    window.location.href = './index.html';
    return;
  }

  // update formularza dot. metody platnosci
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const creditDiv = document.getElementById('payment-cc');
  const blikDiv = document.getElementById('payment-blik');

  paymentRadios.forEach((radio) => {
    radio.addEventListener('change', () =>
      updatePaymentMethodDisplay(creditDiv, blikDiv)
    );
  });

  // wywołanie potrzebnych funkcji do wyswietlenia calego UI + bierzaca walidacja formularza
  updatePaymentMethodDisplay(creditDiv, blikDiv);
  updateCartCount('cart-count');
  updateCartCount('form-cart-count');
  renderCartItems();
  attachLiveValidationListeners();



  // walidacja i wysłanie formularza
  const form = document.querySelector('#checkout-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    const valid = handleFormValidation();
    form.classList.add('was-validated');

    if (valid) {
      const shippingData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        street: document.getElementById('street').value.trim(),
        houseNumber: document.getElementById('house-number').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postal-code').value.trim(),
        country: document.getElementById('country').value
      };

      const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
      // domyślna wartość
      let paymentMethod = '';

      if(paymentRadio) {
        if (paymentRadio.id === 'credit-card') {
          paymentMethod = 'Karta kredytowa';
        } else if (paymentRadio.id === 'blik') {
          paymentMethod = 'blik';
        } else if (paymentRadio.id === 'ondelivery') {
          paymentMethod = 'Za pobraniem';
        }
      }

      const order = getOrder();
      order.shippingData = shippingData;
      order.paymentMethod = paymentMethod;

      localStorage.setItem('order', JSON.stringify(order));
      localStorage.removeItem('cart');
      window.location.href = form.action;
    }
  });

});
