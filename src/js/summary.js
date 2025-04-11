document.addEventListener('DOMContentLoaded', () => {
  const order = JSON.parse(localStorage.getItem('order'));

  if (!order || !order.shippingData || !order.products) {
    window.location.href = './checkout.html';
    return;
  }

  const { shippingData, paymentMethod, products, shippingCost, totalProductsPrice, totalPrice } = order;

  const renderShippingInfo = () => {
    const container = document.getElementById('shipping-info');
    if (!container) return;

    container.innerHTML = `
      <h4>Dane dostawy</h4>
      <p><strong>Imię i nazwisko:</strong> ${shippingData.firstName} ${shippingData.lastName}</p>
      <p><strong>Email:</strong> ${shippingData.email}</p>
      <p><strong>Telefon:</strong> ${shippingData.phone}</p>
      <p><strong>Adres:</strong> ${shippingData.street} ${shippingData.houseNumber}, ${shippingData.postalCode} ${shippingData.city}, ${shippingData.country}</p>
    `;
  };

  const renderPaymentInfo = () => {
    const container = document.getElementById('payment-info');
    if (!container) return;
    container.innerHTML = `
      <h4>Metoda płatności</h4>
      <p>${paymentMethod}</p>
    `;
  };

  const renderOrderSummary = () => {
    const container = document.getElementById('order-summary');
    if (!container) return;

    let html = `
      <h4>Podsumowanie zamówienia</h4>
      <ul class="list-group mb-3">
    `;

    products.forEach(item => {
      html += `
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">${item.title}</h6>
            <small class="text-muted">ilość: ${item.quantity}</small>
          </div>
          <span class="text-muted">${(item.price * item.quantity).toFixed(2)} zł</span>
        </li>
      `;
    });

    html += `
      <li class="list-group-item d-flex justify-content-between">
        <span>Wartość produktów</span>
        <strong>${totalProductsPrice.toFixed(2)} zł</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span>Koszt dostawy</span>
        <strong>${shippingCost.toFixed(2)} zł</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span>Do zapłaty łącznie</span>
        <strong>${totalPrice.toFixed(2)} zł</strong>
      </li>
    </ul>`;

    container.innerHTML = html;
  };

  renderShippingInfo();
  renderPaymentInfo();
  renderOrderSummary();
});
