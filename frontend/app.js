// 📄 Main JavaScript file for FRONTEND behavior
import { loadSidebar, loadHeader } from "./utils/componentLoader.js";
import { loadPage } from "./utils/contentLoader.js";
import { checkAuth } from "./utils/authCheck.js";

// Wait until the DOM is fully loaded to execute scripts
window.addEventListener("DOMContentLoaded", () => {
    if (!checkAuth()){
      return;
    }
    loadMainScreen();
});


// Function to load the main screen after successful login
export async function loadMainScreen() {
  const token = localStorage.getItem('token');
  if (token) {
      try {
          // Load the sidebar and header with user information
          await loadSidebar();
          await loadHeader();
          loadPage("calendar", true);
      } catch (error) {
          console.error('Error loading main screen:', error);
          localStorage.clear(); // Clear invalid tokens
          loadPage("login", false);
      }
  } else {
      // No token found, redirect to login
      loadPage("login", false);
  }
}