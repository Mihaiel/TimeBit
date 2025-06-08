import { loadStyle, loadScript, selectElement } from './domUtils.js';
import { loadPage } from './contentLoader.js';

/**
 * Loads the user header html, css and js into the <main> element.
 */
export async function loadHeader() {
  try {
      const path = `/components/header/header.html`;

      // Fetch the header HTML
      const res = await fetch(path);
      const html = await res.text();

      // Inject the header HTML into the <main> element
      document.querySelector("main aside").innerHTML = html;

      // Load the header style
      loadStyle("/components/header/header.css");
      loadScript("/components/header/header.js");

      // Retrieve the logged-in user's information from localStorage
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
          // Update the header with the logged-in user's name
          const userNameElement = document.querySelector(".header .user-header h2.base");
          userNameElement.textContent = `${user.firstName} ${user.lastName}`;
      }

  } catch (error) {
      console.error("❌ Failed to load HEADER:", error);
  }
}

/**
 * Loads the sidebar HTML into the <nav> element and attaches event listeners to all navigation buttons.
 * This is for general sidebar functionality.
 */
export async function loadSidebar() {
  try {
    // Fetch the sidebar HTML from the components folder
    const res = await fetch("/components/sidebar/sidebar.html");
    const html = await res.text();

    // Inject the sidebar HTML into the <nav> element
    const nav = document.querySelector("nav");
    nav.innerHTML = html;

    // Load the sidebar CSS
    loadStyle("/components/sidebar/sidebar.css");
    loadScript("/components/sidebar/sidebar.js");

    // Attach event listeners to sidebar buttons
    document.querySelectorAll(".sidebar-button-container").forEach(link => {
      link.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;  // Get the target page from the data attribute

        // Change the header title based on the page
        const content_title = document.querySelector(".header h1");
        content_title.innerHTML = page.toUpperCase();

        selectElement(e.currentTarget);  // Highlight the clicked element
        loadPage(page);

      });
    });
  } catch (error) {
    console.error("❌ Failed to load sidebar:", error);
  }
}

/**
 * Loads the ADMIN sidebar HTML into the <nav> element and attaches event listeners.
 * This is for the development sidebar functionality.
 */
export async function loadAdminSidebar() {
  try {
    // Fetch the admin sidebar HTML from the components folder
    const res = await fetch("/components/sidebar-admin/sidebar-admin.html");
    const html = await res.text();

    // Inject the admin sidebar HTML into the <nav> element
    const nav = document.querySelector("nav");
    nav.innerHTML = html;

    // Load the admin sidebar CSS
    loadStyle("/components/sidebar-admin/sidebar-admin.css");
    loadScript("/components/sidebar-admin/sidebar-admin.js");

    // Attach event listeners to sidebar buttons for admin navigation
    document.querySelectorAll(".sidebar-button-container").forEach(link => {
      link.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;  // Get the target page from the data attribute

        // Change the header title based on the page
        const content_title = document.querySelector(".header h1");
        content_title.innerHTML = page.toUpperCase();

        selectElement(e.currentTarget);  // Highlight the clicked element
        loadPage(page);
      });
    });

    // Attach event listener to "info" button
    const infoButton = document.querySelector(".info");
    infoButton.addEventListener("click", () => {
      loadPage("info", false);  // Load the info page from outside-app folder
    });

  } catch (error) {
    console.error("❌ Failed to§ load sidebar:", error);
  }
}