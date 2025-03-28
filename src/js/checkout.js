import { updateCartCount } from './cart.js';
export const getOrder = () => {
  return JSON.parse(localStorage.getItem('order')) || [];
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

  const totalPrice = (getOrder().totalPrice).toString();

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
  const creditRadio = document.getElementById('credit');
  const blikRadio = document.getElementById('blik');
  const onDeliveryRadio = document.getElementById('ondelivery');

  if (creditRadio.checked) {
    creditDiv.classList.remove('d-none');
    blikDiv.classList.add('d-none');
  } else if (blikRadio.checked){
    creditDiv.classList.add('d-none');
    blikDiv.classList.remove('d-none');
  } else if (onDeliveryRadio.checked){
    creditDiv.classList.add('d-none');
    blikDiv.classList.add('d-none');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const order = localStorage.getItem('order');
  if (!order) {
    window.location.href = './index.html';
  }

  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const creditDiv = document.getElementById('payment-cc');
  const blikDiv = document.getElementById('payment-blik');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => updatePaymentMethodDisplay(creditDiv, blikDiv));
  })
  updatePaymentMethodDisplay(creditDiv, blikDiv);

  updateCartCount('cart-count');
  updateCartCount('form-cart-count');
  renderCartItems();
});
