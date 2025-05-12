// 📄 Main JavaScript file for FRONTEND behavior

// Wait until the DOM is fully loaded to execute scripts
window.addEventListener("DOMContentLoaded", () => {
    if (!checkAuth()){
      return;
    }
    loadMainScreen();
});

/**
 * Loads the sidebar HTML into the <nav> element and attaches event listeners to all navigation buttons.
 * This is for general sidebar functionality.
 */
async function loadSidebar() {
  try {
    // Fetch the sidebar HTML from the components folder
    const res = await fetch("/components/sidebar/sidebar.html");
    const html = await res.text();

    // Inject the sidebar HTML into the <nav> element
    const nav = document.querySelector("nav");
    nav.innerHTML = html;

    // Load the sidebar CSS
    loadStyle("/components/sidebar/sidebar.css");
    loadScript("/components/sidebar/sidebar.js")

    // Attach event listeners to sidebar buttons
    // Attach event listeners to sidebar buttons for admin navigation
    document.querySelectorAll(".sidebar-button-container").forEach(link => {
      link.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;  // Get the target page from the data attribute

        // Change the header title based on the page
        const content_title = document.querySelector(".header h1");
        content_title.innerHTML = page.toUpperCase();

        selectElement(e.currentTarget);  // Highlight the clicked element

        // Load the page either from the inside-app or outside-app folder based on the page
        if (page === "login" || page === "register") {
          safeLoadPage(page, false);
        } else {
          safeLoadPage(page, true);
        }
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
async function loadAdminSidebar() {
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

        // Load the page either from the inside-app or outside-app folder based on the page
        if (page === "login" || page === "register") {
          safeLoadPage(page, false);
        } else {
          safeLoadPage(page, true);
        }
      });
    });

    // Attach event listener to "info" button
    const infoButton = document.querySelector(".info");
    infoButton.addEventListener("click", () => {
      safeLoadPage("info", false);  // Load the info page from outside-app folder
    });

  } catch (error) {
    console.error("❌ Failed to load sidebar:", error);
  }
}

/**
 * Highlights the clicked navigation button and removes highlight from others.
 * (In the Sidebar)
 */
function selectElement(clickedElement) {
  // Remove 'nav-selected' class from all elements
  document.querySelectorAll(".sidebar-button-container.nav-selected")
    .forEach(el => el.classList.remove("nav-selected"));

  // Add 'nav-selected' class to the clicked element
  clickedElement.classList.add("nav-selected");
}

/**
 * Loads the User header HTML into main content with corresponding CSS
 */
async function loadHeader() {
  try {
      const path = `/components/header/header.html`;

      // Fetch the header HTML
      const res = await fetch(path);
      const html = await res.text();

      // Inject the header HTML into the <main> element
      document.querySelector("main aside").innerHTML = html;

      // Load the header style
      loadStyle(`${path.replace(".html", ".css")}`);

      // Retrieve the logged-in user's information from localStorage
      const user = JSON.parse(localStorage.getItem("token"));

      if (user) {
          // Update the header with the logged-in user's name
          const userNameElement = document.querySelector(".header .user-header h2.base");
          userNameElement.textContent = `${user.first_name} ${user.last_name}`;
      }

  } catch (error) {
      console.error("❌ Failed to load HEADER:", error);
  }
}

/**
 * Loads a CSS stylesheet into the document.
 * Ensures no duplicate or unnecessary styles are loaded.
 */
function loadStyle(href) {
  // Check if the stylesheet is already loaded
  const existingLink = document.querySelector(`link.page-style[href="${href}"]`);
  
  if (existingLink) {
    // If the stylesheet is already loaded, do nothing
    return;
  }

  // Create a new <link> element for the stylesheet
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.className = "page-style";  // Add a class for easy identification
  link.href = href;

  // Append the stylesheet to the document head
  document.head.appendChild(link);
}

/**
 * Dynamically loads a JavaScript file and appends it to the document body.
 */
function loadScript(src) {
  // Remove previously loaded page-specific scripts
  document.querySelectorAll("script.page-script").forEach(script => script.remove());

  // Create a new <script> element
  const script = document.createElement("script");
  script.src = src;
  script.className = "page-script";  // Add a class for easy identification
  script.type = "text/javascript";

  // Makes sure to call the script when the page has been loaded (otherwise it won't work)
  script.onload = () => {
    console.log(`${src} loaded`);
    if (typeof window.pageInit === "function") {
      window.pageInit();
    }
  };

  // Append the script to the document body
  document.body.appendChild(script);
}

/**
 * Checks if a file exists by sending a HEAD request.
 * Returns a promise that resolves to true if the file exists, false otherwise.
 */
function fileExists(path) {
  return fetch(path, { method: 'HEAD' }).then(res => res.ok).catch(() => false);
}

/**
 * Safely loads a page by fetching its HTML, CSS, and JS (if available).
 * Handles errors and ensures the page is properly loaded into the main content.
 */
async function safeLoadPage(page, inside = true) {
  try {
    // Step 1: Construct the base path for the page (inside or outside app folder)
    const baseDir = inside ? "inside-app" : "outside-app";
    const basePath = `/main-pages/${baseDir}/${page}/${page}`;

    // Step 2: Try to load the HTML file
    const htmlRes = await fetch(`${basePath}.html`);
    if (!htmlRes.ok) throw new Error(`Page not found: ${page}`);
    const html = await htmlRes.text();

    // Step 3: Load HTML into the main content area
    document.querySelector("#main-content").innerHTML = html;

    // Step 4: Try to load the associated CSS if it exists
    if (await fileExists(`${basePath}.css`)) {
      loadStyle(`${basePath}.css`);
    }

    // Step 5: Try to load the associated JS if it exists
    if (await fileExists(`${basePath}.js`)) {
      loadScript(`${basePath}.js`);
    }

  } catch (err) {
    console.error(`❌ Failed to load page "${page}":`, err.message);  // Log any errors
  }
}

async function safeUnloadPage(page, inside = true) {
  try {
    const baseDir = inside ? "inside-app" : "outside-app";
    const basePath = `/main-pages/${baseDir}/${page}/${page}`;

    // Step 1: Clear the main and nav content
    document.querySelector("aside").innerHTML = "";
    document.querySelector("nav").innerHTML = "";

    // Step 2: Remove dynamically loaded CSS
    const cssHref = `${basePath}.css`;
    document.querySelectorAll(`link[rel="stylesheet"]`).forEach(link => {
      if (link.href.includes(cssHref)) {
        link.remove();
      }
    });

    // Step 3: Remove dynamically loaded script tags
    const jsSrc = `${basePath}.js`;
    document.querySelectorAll(`script`).forEach(script => {
      if (script.src.includes(jsSrc)) {
        script.remove();
      }
    });

  } catch (err) {
    console.error(`❌ Failed to unload page "${page}":`, err.message);
  }
}


// Function to load the main screen after successful login
async function loadMainScreen() {
  const token = localStorage.getItem('token');
  if (token) {
      try {
          // Load the sidebar and header with user information
          await loadSidebar();
          await loadHeader();
          safeLoadPage("calendar", true);
      } catch (error) {
          console.error('Error loading main screen:', error);
          localStorage.clear(); // Clear invalid tokens
          safeLoadPage("login", false);
      }
  } else {
      // No token found, redirect to login
      safeLoadPage("login", false);
  }
}

function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
      safeLoadPage("login", false);
      return false;
  }
  return true;
}