document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initNewsletter();
  renderCheckoutSummary();
  setupCheckoutValidation();
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

// Calculate final total and display order summary from cart
function renderCheckoutSummary() {
  const container = document.getElementById("checkoutSummaryItems");
  const finalTotalEl = document.getElementById("checkoutFinalTotal");

  if (!container || !finalTotalEl) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    finalTotalEl.textContent = "$0.00";
    return;
  }

  container.innerHTML = "";
  let finalTotal = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    finalTotal += subtotal;

    const row = document.createElement("div");
    row.classList.add("checkout-summary-row");
    row.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>$${subtotal.toFixed(2)}</span>
    `;
    container.appendChild(row);
  });

  finalTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

// Validate form inputs and handle successful checkout
function setupCheckoutValidation() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");
    const paymentMethodInput = document.getElementById("paymentMethod");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const addressError = document.getElementById("addressError");
    const paymentError = document.getElementById("paymentError");

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    addressError.textContent = "";
    paymentError.textContent = "";

    // Validate Full Name
    if (!fullNameInput.value.trim()) {
      nameError.textContent = "Full name is required.";
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = "Email address is required.";
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate Address
    if (!addressInput.value.trim()) {
      addressError.textContent = "Delivery address is required.";
      isValid = false;
    }

    // Validate Payment Method
    if (!paymentMethodInput.value) {
      paymentError.textContent = "Please select a payment method.";
      isValid = false;
    }

    if (!isValid) return;

    // Check if cart has items
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty. Cannot process checkout.");
      return;
    }

    // Calculate final total
    let finalTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order object for order history
    const orderData = {
      orderId: 'TH-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      customer: {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        address: addressInput.value.trim(),
        paymentMethod: paymentMethodInput.value
      },
      items: cart,
      total: finalTotal
    };

    // Store order history in localStorage
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orderHistory.push(orderData);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    // Clear cart from localStorage
    localStorage.removeItem("cart");

    // Show animated success message overlay
    const successOverlay = document.getElementById("successOverlay");
    if (successOverlay) {
      successOverlay.style.display = "flex";
      successOverlay.setAttribute("aria-hidden", "false");
    }
  });
}