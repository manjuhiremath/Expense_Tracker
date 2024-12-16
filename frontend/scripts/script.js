// script.js
import BASE_URL from './baseurl';
// Base URL of your Express API


// Utility function to display messages
function displayMessage(elementId, message, isError = false) {
  const messageElement = document.getElementById(elementId);
  messageElement.textContent = message;
  messageElement.className = isError ? "error" : "success";
}

// Handle Sign-Up
document.getElementById("signup-button").addEventListener("Click", async () => {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    displayMessage("signup-message", "All fields are required!", true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage("signup-message", "Sign-Up successful!");
    } else {
      displayMessage("signup-message", data.error || "Sign-Up failed!", true);
    }
  } catch (error) {
    console.error(error);
    displayMessage("signup-message", "Something went wrong!", true);
  }
});

// Handle Login
document.getElementById("login-button").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    displayMessage("login-message", "All fields are required!", true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      displayMessage("login-message", "Login successful!");
    } else {
      displayMessage("login-message", data.error || "Login failed!", true);
    }
  } catch (error) {
    console.error(error);
    displayMessage("login-message", "Something went wrong!", true);
  }
});
