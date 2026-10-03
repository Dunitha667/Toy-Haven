document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initHeroSlider();
  initNewsletter();
  renderProducts();
  initScrollAnimations();
});

function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle Navigation');

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}

function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (!slider || slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 4000;
  let timer = null;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  function startSlider() {
    if (!timer) {
      timer = setInterval(nextSlide, slideInterval);
    }
  }

  function stopSlider() {
    clearInterval(timer);
    timer = null;
  }

  startSlider();

  slider.addEventListener('mouseenter', stopSlider);
  slider.addEventListener('mouseleave', startSlider);
  slider.addEventListener('focusin', stopSlider);
  slider.addEventListener('focusout', startSlider);
}

function renderProducts() {
  const productsData = [
    {
      name: "Superhero Action Figure",
      price: "$29.99",
      image: "images/figurine.jpg"
    },
    {
      name: "Strategy Quest Game",
      price: "$45.00",
      image: "images/boardgame.webp"
    },
    {
      name: "1:24 Scale Sports Car",
      price: "$19.99",
      image: "images/car.jpg"
    }
  ];

  // 1. Render Featured Highlights Grid
  const featuredContainer = document.getElementById('featured-product-container');
  if (featuredContainer) {
    productsData.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <a href="Product-Listing.html" class="btn">Shop Now</a>
      `;
      featuredContainer.appendChild(card);
    });
  }

  // 2. Render Separate Product of the Day Section
  const potdContainer = document.getElementById('potd-container');
  if (potdContainer && productsData.length > 0) {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const potdIndex = dayOfYear % productsData.length;
    const potdProduct = productsData[potdIndex];

    const potdCard = document.createElement('div');
    potdCard.className = 'potd-card';
    potdCard.innerHTML = `
      <img src="${potdProduct.image}" alt="${potdProduct.name}" class="potd-image">
      <h3>${potdProduct.name}</h3>
      <p class="price">${potdProduct.price}</p>
      <a href="Product-Listing.html" class="btn">Shop Now</a>
    `;
    potdContainer.appendChild(potdCard);
  }
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  });
  
  reveals.forEach(reveal => observer.observe(reveal));
}

function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const message = document.getElementById("newsletterMsg");

  if (form && emailInput && message) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (email) {
        setStorageItem("newsletterEmail", email);
        message.textContent = "Subscribed successfully!";
        emailInput.value = "";
      }
    });
  }
}

function getStorageItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return localStorage.getItem(key);
  }
}

function setStorageItem(key, value) {
  const data = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
}