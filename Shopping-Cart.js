document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initNewsletter();
  renderCart();
  setupCartActions();
});

// Toggle navigation menu on mobile devices
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      navLinks.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
}

// Store newsletter email in localStorage
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const message = document.getElementById("newsletterMsg");

  if (form && emailInput && message) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (email) {
        localStorage.setItem("newsletterEmail", email);
        message.textContent = "Subscribed successfully!";
        emailInput.value = "";
      }
    });
  }
}

// Load and render cart items from localStorage
function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const totalItemsEl = document.getElementById("summaryTotalItems");
  const totalPriceEl = document.getElementById("summaryTotalPrice");
  
  if (!container) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart-msg">Your shopping cart is currently empty.</p>`;
    if (totalItemsEl) totalItemsEl.textContent = "0";
    if (totalPriceEl) totalPriceEl.textContent = "$0.00";
    return;
  }

  let totalItemsCount = 0;
  let overallTotalPrice = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    totalItemsCount += item.quantity;
    overallTotalPrice += subtotal;

    const card = document.createElement("div");
    card.classList.add("cart-item-card");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p class="cart-item-price">Price: $${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <button class="remove-item-btn" onclick="removeItem(${index})">Remove</button>
      </div>
      <div class="cart-item-subtotal">
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
      </div>
    `;
    container.appendChild(card);
  });

  if (totalItemsEl) totalItemsEl.textContent = totalItemsCount;
  if (totalPriceEl) totalPriceEl.textContent = `$${overallTotalPrice.toFixed(2)}`;
}

// Adjust item quantity (+ / -)
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Remove single item completely from cart
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Setup clear cart and checkout triggers
function setupCartActions() {
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        localStorage.removeItem("cart");
        renderCart();
      }
    });
  }

  if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
          alert("Your cart is empty. Add products before proceeding to checkout.");
          return;
        }
        window.location.href = "Checkout.html";
      });
    }
}