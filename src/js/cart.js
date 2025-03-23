document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
                <button class="btn btn-outline-secondary btn-sm" type="button">-</button>
                  <input style="max-width:100px" type="text" class="form-control  form-control-sm text-center quantity-input" value="${item.quantity}">
                <button class="btn btn-outline-secondary btn-sm" type="button">+</button>
            </div>
        </div>
        <div class="col-md-2 text-end">
            <p class="fw-bold">${item.price} zł</p>
            <button class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
            </button>
        </div>
      </div>
      <hr>
      `;
    });
    cartItemsContainer.innerHTML = htmlContent;
  }

});
