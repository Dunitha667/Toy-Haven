// Product data array of JavaScript objects
const products = [
  { id: 1, name: "Superhero Action Figure", category: "Figurines", price: 29.99, image: "images/figurine.jpg", description: "Detailed 12-inch action figure with display stand." },
  { id: 2, name: "Anime Hero Statue", category: "Figurines", price: 49.99, image: "images/anime.webp", description: "Hand-painted collector statue with metallic finish." },
  { id: 3, name: "Wooden Building Blocks", category: "Toys", price: 15.99, image: "images/Building-Blocks.jpg", description: "Classic 50-piece wooden block set for kids." },
  { id: 4, name: "Remote Control Robot", category: "Toys", price: 34.99, image: "images/RC-Robot.png", description: "Interactive robot with motion controls." },
  { id: 5, name: "Strategy Quest Game", category: "Board Games", price: 45.00, image: "images/boardgame.webp", description: "Tactical board game for 2 to 4 players." },
  { id: 6, name: "Family Trivia Master", category: "Board Games", price: 24.99, image: "images/Trivia-Master.jpg", description: "Over 1,000 trivia questions for family game night." },
  { id: 7, name: "1:24 Scale Sports Car", category: "Diecast Cars", price: 19.99, image: "images/car.jpg", description: "Precision diecast vehicle with opening doors." },
  { id: 8, name: "Vintage Classic Coupe", category: "Diecast Cars", price: 22.50, image: "images/Vintage-Car.jpg", description: "Retro 1:24 scale replica with authentic interior." }
];

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initNewsletter();
  renderFeaturedProductOfDay();
  renderProducts(products);
  setupSearchAndFilter();
  setupModalEvents();
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

// Render Featured Product of the Day
function renderFeaturedProductOfDay() {
  const container = document.getElementById("featuredDayCard");
  if (!container) return;

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const featured = products[dayOfYear % products.length];

  container.innerHTML = `
    <span class="featured-badge">Featured Product of the Day</span>
    <div class="featured-day-content">
      <img src="${featured.image}" alt="${featured.name}">
      <div>
        <h3>${featured.name}</h3>
        <p class="category-tag">${featured.category}</p>
        <p class="price">$${featured.price.toFixed(2)}</p>
        <div class="card-buttons">
          <button class="btn" onclick="addToCart(${featured.id})">Add to Cart</button>
          <button class="btn btn-secondary" onclick="addToWishlist(${featured.id})">Add to Wishlist</button>
          <button class="btn btn-secondary" onclick="openModal(${featured.id})">View Details</button>
        </div>
      </div>
    </div>
  `;
}

// Render product interactive cards
function renderProducts(items) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = "<p style='color: white;'>No products match your search criteria.</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" onclick="openModal(${product.id})">
      <h3>${product.name}</h3>
      <p class="category-tag">${product.category}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <div class="card-buttons">
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">Add to Wishlist</button>
        <button class="btn btn-secondary" onclick="openModal(${product.id})">View Details</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter product data by category dropdown and search term
function setupSearchAndFilter() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  function filterProducts() {
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "All";

    const filtered = products.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchValue);
      return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
}

// Open modal pop-up window
function openModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");

  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="modal-img">
    <h2>${product.name}</h2>
    <p class="category-tag">${product.category}</p>
    <p class="price">$${product.price.toFixed(2)}</p>
    <p class="description">${product.description}</p>
    <div class="card-buttons">
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">Add to Wishlist</button>
    </div>
  `;

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
}

// Close modal event listeners
function setupModalEvents() {
  const modal = document.getElementById("productModal");
  const closeBtn = document.getElementById("closeModalBtn");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (modal && event.target === modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

// Save item to cart in localStorage
function addToCart(productId) {
  const selectedProduct = products.find(p => p.id === productId);
  if (!selectedProduct) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...selectedProduct, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${selectedProduct.name} added to cart!`);
}

// Save item to wishlist in localStorage
function addToWishlist(productId) {
  const selectedProduct = products.find(p => p.id === productId);
  if (!selectedProduct) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const exists = wishlist.some(item => item.id === productId);
  if (!exists) {
    wishlist.push({ ...selectedProduct, status: "Interested" });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${selectedProduct.name} added to wishlist!`);
  } else {
    alert(`${selectedProduct.name} is already in your wishlist.`);
  }
}