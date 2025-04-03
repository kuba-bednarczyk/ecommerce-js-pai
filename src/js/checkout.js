import { updateCartCount } from './cart.js';
export const getOrder = () => {
  return JSON.parse(localStorage.getItem('order')) || [];
};

const handleFormValidation = () => {
  const form = document.getElementById('checkout-form');
  form.classList.remove('was-validated');

  let isValid = true;

  const nameRegex = /^[A-Z][a-z]+$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const phoneRegex = /^\d{3}\s?\d{3}\s?\d{3}$/;
  const addressRegex = /^[A-Z][a-z]+ \d+(?:[a-z])?(?:\/\d+(?:[a-z])?)?$/;
  const cityRegex = /^[A-Z][a-z]+$/;
  const postalRegex = /^\d{2}-\d{3}$/;

  const ccNameRegex = /^[A-Z]+\s[A-Z]+$/;
  const ccNumberRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
  const ccCVCRegex = /^\d{3}$/;
  const ccExpirationRegex = /^(0[1-9]|1[0-2]\/\d{2}$)/;

  const blikRegex = /^\d{6}$/;

  // delivery data
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');
  const city = document.getElementById('city');
  const postalCode = document.getElementById('postal-code');

  // credit card data
  const ccName = document.getElementById('cc-name');
  const ccNumber = document.getElementById('cc-number');
  const ccCVC = document.getElementById('cc-cvc');
  const ccExpiration = document.getElementById('cc-expiration');

  //blik code data
  const blikCode = document.getElementById('blik-code');

  if (!nameRegex.test(firstName.value.trim())) {
    firstName.setCustomValidity('Invalid');
    isValid = false;
  } else {
    firstName.setCustomValidity('');
  }

  if (!nameRegex.test(lastName.value.trim())) {
    lastName.setCustomValidity('Invalid');
    isValid = false;
  } else {
    lastName.setCustomValidity('');
  }

  if (!emailRegex.test(email.value.trim())) {
    email.setCustomValidity('Invalid');
    isValid = false;
  } else {
    email.setCustomValidity('');
  }

  if (!phoneRegex.test(phone.value.trim())) {
    phone.setCustomValidity('Invalid');
    isValid = false;
  } else {
    phone.setCustomValidity('');
  }

  if (!phoneRegex.test(phone.value.trim())) {
    phone.setCustomValidity('Invalid');
    isValid = false;
  } else {
    phone.setCustomValidity('');
  }

  if (!addressRegex.test(address.value.trim())) {
    address.setCustomValidity('Invalid');
    isValid = false;
  } else {
    phone.setCustomValidity('');
  }

  if (!cityRegex.test(city.value.trim())) {
    city.setCustomValidity('Invalid');
    isValid = false;
  } else {
    city.setCustomValidity('');
  }

  if (!postalRegex.test(postalCode.value.trim())) {
    postalCode.setCustomValidity('Invalid');
    isValid = false;
  } else {
    postalCode.setCustomValidity('');
  }

  if (document.getElementById('credit-card').checked) {
    if (!ccNameRegex.test(ccName.value.trim())) {
      ccName.setCustomValidity('Invalid');
      isValid = false;
    } else {
      ccName.setCustomValidity('');
    }

    if (!ccNumberRegex.test(ccNumber.value.trim())) {
      ccNumber.setCustomValidity('Invalid');
      isValid = false;
    } else {
      ccNumber.setCustomValidity('');
    }

    if (!ccCVCRegex.test(ccCVC.value.trim())) {
      ccCVC.setCustomValidity('Invalid');
      isValid = false;
    } else {
      ccCVC.setCustomValidity('');
    }

    if (!ccExpirationRegex.test(ccExpiration.value.trim())) {
      ccExpiration.setCustomValidity('Invalid');
      isValid = false;
    } else {
      ccExpiration.setCustomValidity('');
    }
  } else if(document.getElementById('blik').checked) {
    if (!blikRegex.test(blikCode.value.trim())) {
      blikCode.setCustomValidity('Invalid');
      isValid = false;
    } else {
      blikCode.setCustomValidity('');
    }
  }

  return isValid;
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
  // przejscie do index.html, jesli nie ma obiektu order w localstorage
  if (!order) {
    window.location.href = './index.html';
  }

  // zmiana formularza zaleznie od wybranego buttona radio
  const paymentRadios = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
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

  // walidacja formularza
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    if (!handleFormValidation()) {
      e.preventDefault();
      e.stopPropagation();
    }

    form.classList.add('was-validated')
  });
});
