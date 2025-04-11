import { updateCartCount } from './cart.js';

export const getOrder = () => {
  try {
    return JSON.parse(localStorage.getItem('order')) || [];
  } catch (e) {
    console.warn('Błąd parsowania danych zamówienia:', e);
    return [];
  }
};

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

const renderCartItems = () => {
  const order = getOrder();
  const { products, totalPrice } = order;
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
      <span class="">9,99 zł</span>
    </li>
    <li class="list-group-item d-flex justify-content-between">
      <strong>Do zapłaty:</strong>
      <strong id="order-total">${totalPrice} zł</strong>
    </li>
  `;

  productsListElement.innerHTML = htmlContent;
};

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

document.addEventListener('DOMContentLoaded', () => {
  const order = localStorage.getItem('order');
  if (!order) {
    window.location.href = './index.html';
    return;
  }

  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const creditDiv = document.getElementById('payment-cc');
  const blikDiv = document.getElementById('payment-blik');

  paymentRadios.forEach((radio) => {
    radio.addEventListener('change', () =>
      updatePaymentMethodDisplay(creditDiv, blikDiv)
    );
  });

  updatePaymentMethodDisplay(creditDiv, blikDiv);
  updateCartCount('cart-count');
  updateCartCount('form-cart-count');
  renderCartItems();
  attachLiveValidationListeners();

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
      window.location.href = form.action;
    }
  });

});
