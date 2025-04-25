import { getUser } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();

  if (user) {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    //dane uzytkownika w formularzu
    if (usernameInput) usernameInput.value = user.username || "";
    if (emailInput) emailInput.value = user.email || "";
    if (passwordInput) passwordInput.value = user.password || "";

    //dane dostawy w formularzu
    if (user.shippingData) {
      const shippingData = user.shippingData;

      document.getElementById("firstName").value = shippingData.firstName || "";
      document.getElementById("lastName").value = shippingData.lastName || "";
      document.getElementById("delivery-email").value = shippingData.email || "";
      document.getElementById("phone").value = shippingData.phone || "";
      document.getElementById("street").value = shippingData.street || "";
      document.getElementById("house-number").value = shippingData.houseNumber || "";
      document.getElementById("city").value = shippingData.city || "";
      document.getElementById("postal-code").value = shippingData.postalCode || "";
      document.getElementById("country").value = shippingData.country || "";
    }
  }


  //update danych do localstorage
  const accountForm = document.getElementById("account-form");
  if (accountForm) {
    accountForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedUser = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        shippingData: {
          firstName: document.getElementById("firstName").value.trim(),
          lastName: document.getElementById("lastName").value.trim(),
          email: document.getElementById("delivery-email").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          street: document.getElementById("street").value.trim(),
          houseNumber: document.getElementById("house-number").value.trim(),
          city: document.getElementById("city").value.trim(),
          postalCode: document.getElementById("postal-code").value.trim(),
          country: document.getElementById("country").value,
        },
        loggedIn: true, 
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Dane zostały zapisane!");
    });
  }

  //wylogowanie
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (user && user.loggedIn) {
        user.loggedIn = false;
        localStorage.setItem("user", JSON.stringify(user));

        alert("Wylogowano pomyślnie!");
        window.location.href = "./index.html";
      }
    });
  }
});