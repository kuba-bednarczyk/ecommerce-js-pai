import { updateCartCount } from './cart.js';
export const getOrder = () => {
  return JSON.parse(localStorage.getItem('order')) || [];
};

const handleFormValidation = () => {
  const deliveryDataValidations = [
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
    }
  ];
  
  const ccValidations = [
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

  let allValid = true;

  // Walidacja danych dostawy
  deliveryDataValidations.forEach(item => {
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

  // Pobieramy zaznaczony radio button metod płatności
  const paymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
  // Upewnij się, że istnieje zaznaczony radio button
  if (!paymentMethodRadio) {
    allValid = false;
  } else {
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
  }

  return allValid;
};

const renderCartItems = () => {
  const { products } = getOrder();
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
        ${parseFloat(item.price * item.quantity).toFixed(2)} zł
      </span>
    </li>
    `;
  });

  const totalPrice = getOrder().totalPrice.toString();

  htmlContent += `
    <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
      <div>
        <h6 class="my-0">Koszt dostawy (kurier):  </h6>
      </div>
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
  // Przejście do index.html, jeśli nie ma obiektu order w localStorage
  if (!order) {
    window.location.href = './index.html';
  }

  // Zmiana widoku formularza płatności w zależności od wybranego radio buttona
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

  const form = document.querySelector('#checkout-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    const valid = handleFormValidation();

    form.classList.add('was-validated');

    if (valid) {
      window.location.href = form.action;
    }
  });
});
