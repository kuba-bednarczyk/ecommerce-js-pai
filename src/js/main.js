import { updateCartCount } from "./cart.js";
const API_URL = "https://fakestoreapi.com/products";

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.querySelector("#homepage-products");
  
  fetch(API_URL)
    .then(res => {
      if (!res.ok) {
        throw new Error("Błąd przy pobieraniu danych");
      }
      return res.json();
    })
    .then(products => {
      const selectedProducts = products.slice(0,12);

      let html = ``;
      selectedProducts.forEach(product => {
        html += `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card product-card h-100">
              <img src="${product.image}" class="card-img-top" alt="${product.title}">
              <div class="card-body d-flex flex-column">
                <h5 class="fw-bolder text-start">${product.title}</h5>
                <p class="fs-5 text-start">${product.price} zł</p>
                <button class="add-to-cart btn btn-dark align-self-end mt-auto"
                  data-id="${product.id}"
                  data-category="${product.category}"
                  data-title="${product.title}"
                  data-price="${product.price}"
                  data-image="${product.image}"
                >
                  Do koszyka
                </button>
              </div>
            </div>
          </div>
        `
      });
      productsContainer.innerHTML = html;

      const cartButtons = document.querySelectorAll('.add-to-cart');
      cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const title = btn.getAttribute('data-title');
          const category = btn.getAttribute('data-category');
          const price = btn.getAttribute('data-price');
          const image = btn.getAttribute('data-image');

          let cart = JSON.parse(localStorage.getItem('cart')) || [];

          const existingProductIndex = cart.findIndex(item => item.id === id);
          if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
          } else {
            cart.push({
              id,
              title,
              category,
              price,
              image,
              quantity: 1
            });
          }

          localStorage.setItem('cart', JSON.stringify(cart));

          updateCartCount();
        });
      });

      updateCartCount();
    })
    .catch(err => {
      console.error("Błąd: ", err);
    });
});

