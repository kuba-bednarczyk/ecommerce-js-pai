import { showAddToCartPopup, updateCartCount } from "./utils.js";

const API_URL = "https://fakestoreapi.com/products";
const CATEGORIES = [
  { id: "all", name: "Wszystkie" },
  { id: "men's clothing", name: "Odzież męska" },
  { id: "women's clothing", name: "Odzież damska" },
  { id: "electronics", name: "Elektronika" },
  { id: "jewelery", name: "Biżuteria" }
];

const renderFilters = (container, callback) => {
  let html = '<div class="mb-4 d-flex gap-2 flex-wrap">';
  CATEGORIES.forEach(cat => {
    html += `
      <button class="btn btn-outline-dark btn-sm category-filter" data-category="${cat.id}">
        ${cat.name}
      </button>
    `;
  });
  html += '</div>';
  container.insertAdjacentHTML('afterbegin', html);

  const filterButtons = document.querySelectorAll('.category-filter');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selected = btn.getAttribute('data-category');
      callback(selected);
    });
  });
};

const renderProducts = (products, container) => {
  let html = "";
  products.forEach(product => {
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
    `;
  });
  container.innerHTML = html;
};

const attachCartListeners = () => {
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
        cart.push({ id, title, category, price, image, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount('cart-count');
      showAddToCartPopup(title);
    });
  });
};

const filterAndRender = (allProducts, selectedCategory, container) => {
  const filtered = selectedCategory === "all"
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);
  renderProducts(filtered, container);
  attachCartListeners();
};

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.querySelector("#homepage-products");
  const parentSection = productsContainer.closest('section');

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error("Błąd przy pobieraniu danych");
      return res.json();
    })
    .then(products => {
      renderFilters(parentSection, selectedCategory => {
        filterAndRender(products, selectedCategory, productsContainer);
      });
      filterAndRender(products, "all", productsContainer);
      document.querySelector('.category-filter[data-category="all"]').classList.add('active');
      updateCartCount("cart-count");
    })
    .catch(err => console.error("Błąd: ", err));
});
