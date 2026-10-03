document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initNewsletter();
  setupFeedbackValidation();
  setupAccordion();
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

// Validate feedback form and store feedback in localStorage
function setupFeedbackValidation() {
  const form = document.getElementById("feedbackForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById("feedbackName");
    const emailInput = document.getElementById("feedbackEmail");
    const messageInput = document.getElementById("feedbackMessage");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const successMsg = document.getElementById("formSuccessMsg");

    // Clear previous errors and confirmation
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    successMsg.style.display = "none";

    // Validate Name
    if (!nameInput.value.trim()) {
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

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = "Message content is required.";
      isValid = false;
    }

    if (!isValid) return;

    // Create feedback record
    const feedbackData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      date: new Date().toISOString()
    };

    // Store feedback in localStorage
    let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackList.push(feedbackData);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

    // Show confirmation message and reset form
    successMsg.textContent = "Thank you! Your feedback has been submitted successfully.";
    successMsg.style.display = "block";
    form.reset();
  });
}

// Initialize FAQ accordion functionality using JavaScript
function setupAccordion() {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isOpen = header.classList.contains("active");

      // Close all accordion items
      headers.forEach(h => {
        h.classList.remove("active");
        h.setAttribute("aria-expanded", "false");
        h.nextElementSibling.style.maxHeight = null;
      });

      // If it wasn't open, open it
      if (!isOpen) {
        header.classList.add("active");
        header.setAttribute("aria-expanded", "true");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}