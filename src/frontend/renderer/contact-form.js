const STORAGE_CONTACTS_KEY = "mercedes_contact_requests";
const STORAGE_NAME_KEY = "mercedes_user_name";

window.setupContactForm = function () {
  const form = document.querySelector(".contacts-page-form");

  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = form.querySelector('input[placeholder="Ваше ім’я"]');
    const phoneInput = form.querySelector('input[placeholder="Телефон"]');
    const emailInput = form.querySelector('input[placeholder="Email"]');
    const messageInput = form.querySelector('textarea[placeholder="Ваше повідомлення"]');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });

    const statusMessage = getOrCreateContactMessage(form);

    if (!isValid) {
      statusMessage.textContent = "Будь ласка, заповніть усі поля форми.";
      statusMessage.style.color = "red";
      return;
    }

    const contactRequest = {
      name,
      phone,
      email,
      message,
      date: new Date().toLocaleString("uk-UA")
    };

    saveContactRequest(contactRequest);
    localStorage.setItem(STORAGE_NAME_KEY, name);

    showGreeting(name);

    statusMessage.textContent = "Дякуємо! Ваше звернення успішно збережено.";
    statusMessage.style.color = "green";

    form.reset();
  });
};

function saveContactRequest(contactRequest) {
  const savedRequests = JSON.parse(localStorage.getItem(STORAGE_CONTACTS_KEY)) || [];

  savedRequests.push(contactRequest);

  localStorage.setItem(STORAGE_CONTACTS_KEY, JSON.stringify(savedRequests));
}

function getOrCreateContactMessage(form) {
  let message = document.getElementById("contact-form-message");

  if (!message) {
    message = document.createElement("p");
    message.id = "contact-form-message";
    message.className = "mt-3";
    form.appendChild(message);
  }

  return message;
}

window.showSavedUserGreeting = function () {
  const savedName = localStorage.getItem(STORAGE_NAME_KEY);

  if (savedName) {
    showGreeting(savedName);
  }
};

function showGreeting(name) {
  let greeting = document.getElementById("user-greeting-message");

  if (!greeting) {
    greeting = document.createElement("div");
    greeting.id = "user-greeting-message";

    const headerContainer = document.querySelector(".site-header .container");

    if (headerContainer) {
      headerContainer.appendChild(greeting);
    }
  }

  greeting.textContent = `Вітаємо, ${name}!`;
}