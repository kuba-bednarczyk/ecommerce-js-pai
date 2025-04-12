// utility functions and cart operations
export const updateCartCount = (elemId) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById(`${elemId}`);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
    if (totalCount > 0) {
      cartBadge.classList.remove('bg-dark');
      cartBadge.classList.add('bg-danger');
    } else {
      cartBadge.classList.remove('bg-danger');
      cartBadge.classList.add('bg-dark');
    }
  }
}

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || []
  } catch (e) {
    console.warn('Błąd parsowania danych koszyka:', e);
    return [];
  }
}
const calculateTotalPrice = () => {
  const totalPriceElem = document.getElementById('total-price');
  if (!totalPriceElem) return;
  
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price*item.quantity, 0);
  document.getElementById('total-price').textContent = `${total.toFixed(2)} zł` || `0.00 zł`;
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

const createOrderObject = () => {
  let cart = getCart();

  if(!cart.length) {
    alert("Twój koszyk jest pusty!");
    return;
  }

  let totalProductsPrice = parseFloat(cart.reduce(
    (sum, item) => sum + item.price * item.quantity
  , 0).toFixed(2));

  let shippingCost = 9.99;
  let totalPrice = totalProductsPrice+shippingCost;

  let order = {
    products: cart,
    shippingCost: shippingCost,
    totalProductsPrice: totalProductsPrice,
    totalPrice: totalPrice,
    shippingData: {}, //imie, nazwisko, email, telefon, ulica i nr domu, miejscowosc, kod pocztowy
    paymentMethod: 'credit card' //blik, on delivery
  }

  localStorage.setItem('order', JSON.stringify(order));
  window.location.href = './checkout.html';
}

// Event handlers
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

// Rendering cart
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
  updateCartCount('cart-count');
}
const initializeCart = () => {
  renderCart();
  calculateTotalPrice();
}
document.addEventListener('DOMContentLoaded', () => { 
  initializeCart(); 
  
  const proceedBtn = document.getElementById('to-checkout');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createOrderObject();
    })
  }

});

