export const getUser = () => JSON.parse(localStorage.getItem('user')) || null;

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || []
  } catch (e) {
    console.warn('Błąd parsowania danych koszyka:', e);
    return [];
  }
}

export const getOrder = () => {
  try {
    return JSON.parse(localStorage.getItem('order')) || [];
  } catch (e) {
    console.warn('Błąd parsowania danych zamówienia:', e);
    return [];
  }
};

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

export const showAddToCartPopup = (productTitle) => {
  let toastContainer = document.querySelector('#cart-toast-container');

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'cart-toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3 z-3';
    toastContainer.style.marginTop = '5rem';
    toastContainer.style.pointerEvents = 'none';
    document.body.appendChild(toastContainer);
  }

  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-white bg-success border-0 mb-2 fade show';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ✅ Dodano do koszyka: <strong>${productTitle}</strong> <br>
        🛒 Produkty w koszyku: <strong>${totalCount}</strong>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    toastEl.classList.remove('show');
    toastEl.addEventListener('transitionend', () => toastEl.remove());
  }, 2500);
};
