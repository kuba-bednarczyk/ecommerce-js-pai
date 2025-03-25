export const updateCartCount = () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cart-count');
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

