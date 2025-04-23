import { getUser } from "./utils.js";



document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  // wylogowanie uzytkownika
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const user = getUser();

      if (user && user.loggedIn) {
        user.loggedIn = false;
        localStorage.setItem("user", JSON.stringify(user));

        alert("Wylogowano pomyślnie!");
        window.location.href = "./index.html";
      }
    });
  }
});