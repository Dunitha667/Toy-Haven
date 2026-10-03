document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initNewsletter();
  renderWishlist();
  setupWishlistFilters();
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

// Render wishlist items based on current filter
function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const statusFilter = document.getElementById("statusFilter");
  
  if (!grid) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const selectedStatus = statusFilter ? statusFilter.value : "All";

  const filteredItems = wishlist.filter(item => {
    if (selectedStatus === "All") return true;
    return item.status === selectedStatus;
  });

  grid.innerHTML = "";

  if (filteredItems.length === 0) {
    grid.innerHTML = `<p class="empty-wishlist-msg">No items found in your wishlist.</p>`;
    return;
  }

  filteredItems.forEach(item => {
    // Find original index in full wishlist array for updating status/removal
    const originalIndex = wishlist.findIndex(w => w.id === item.id);

    const card = document.createElement("div");
    card.classList.add("wishlist-card");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="wishlist-img">
      <h3>${item.name}</h3>
      <p class="category-tag">${item.category}</p>
      <p class="price">$${item.price.toFixed(2)}</p>
      <div class="status-group">
        <label for="status-${item.id}">Collection Status:</label>
        <select id="status-${item.id}" class="status-select" onchange="updateWishlistStatus(${originalIndex}, this.value)">
          <option value="Interested" ${item.status === 'Interested' ? 'selected' : ''}>Interested</option>
          <option value="Owned" ${item.status === 'Owned' ? 'selected' : ''}>Owned</option>
          <option value="Not Interested" ${item.status === 'Not Interested' ? 'selected' : ''}>Not Interested</option>
        </select>
      </div>
      <div class="card-buttons">
        <button class="btn" onclick="addWishlistToCart(${item.id})">Add to Cart</button>
        <button class="btn btn-remove" onclick="removeFromWishlist(${originalIndex})">Remove</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Setup status filter dropdown listener
function setupWishlistFilters() {
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", renderWishlist);
  }
}

// Update item status ("Interested", "Owned", "Not Interested") in localStorage
function updateWishlistStatus(index, newStatus) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist[index]) return;

  wishlist[index].status = newStatus;
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Remove item from wishlist
function removeFromWishlist(index) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist[index]) return;

  wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderWishlist();
}

// Move wishlist item directly into shopping cart
function addWishlistToCart(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const selectedProduct = wishlist.find(item => item.id === productId);
  if (!selectedProduct) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...selectedProduct, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${selectedProduct.name} added to cart from wishlist!`);
}