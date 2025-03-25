import { updateCartCount } from "./cartUtils.js";

const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

const calculateTotalPrice = () => {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price*item.quantity, 0);
  document.getElementById('total-price').textContent = `${total.toFixed(2)} zł`;
}

const updateItemQuantity = (id, change) => {
  let cart = getCart();
  cart = cart.map(item => {
    if (item.id === id) {
      item.quantity += change;
    }
    return item
  }).filter(item => item.quantity > 0);

  if (cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    localStorage.removeItem('cart');
  }

  renderCart();
  calculateTotalPrice();
} 

const attachCartEventListeners = () => {
  const removeButtons = document.querySelectorAll('.remove-item');
  const increaseButtons = document.querySelectorAll('.increase-btn');
  const decreaseButtons = document.querySelectorAll('.decrease-btn');

  removeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      let cart = getCart();
      cart = cart.filter(item => item.id !== id);
      if (cart.length > 0){
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('cart');
      }
      renderCart();
      calculateTotalPrice();
    })
  });

  
  increaseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateItemQuantity(id, 1);
    });
  });

  decreaseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateItemQuantity(id, -1);
    })
  })
}

const renderCart = () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  let cart = getCart();

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Twój koszyk jest pusty.</p>`;
  } else {
    let htmlContent = '';
    cart.forEach((item) => {
      htmlContent += `
      <div class="row cart-item mb-3 product-item">
        <div class="col-md-3">
            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded">
        </div>
        <div class="col-md-5">
            <h5 class="card-title">${item.title}</h5>
            <p class="text-muted capitalize">Category: ${item.category}</p>
        </div>
        <div class="col-md-2">
            <div class="input-group">
                <button class="decrease-btn btn btn-outline-secondary btn-sm" type="button" data-id="${item.id}">-</button>
                  <input style="max-width:100px" type="text" class="form-control  form-control-sm text-center quantity-input" value="${item.quantity}">
                <button class="increase-btn btn btn-outline-secondary btn-sm" type="button" data-id="${item.id}">+</button>
            </div>
        </div>
        <div class="col-md-2 text-end">
            <p class="fw-bold">${item.price} zł</p>
            <button class="remove-item btn btn-sm btn-outline-danger" data-id=${item.id}>
                    <i class="bi bi-trash"></i>
            </button>
        </div>
      </div>
      <hr>
      `;
    });
    cartItemsContainer.innerHTML = htmlContent;
  }

  attachCartEventListeners();
  updateCartCount();
}

const initializeCart = () => {
  renderCart();
  calculateTotalPrice();
}

document.addEventListener('DOMContentLoaded', () => { initializeCart(); });
