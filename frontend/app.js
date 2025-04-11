// 📄 Main JavaScript file for FRONTEND behaviour 

// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    loadSidebar();                // Load the sidebar once on initial load
    loadPage("login", false);     // Load the default page content (dashboard)
  });
  
  /**
   * Loads the sidebar HTML into the <aside> element
   * and attaches click listeners to all navigation buttons
   */
  async function loadSidebar() {
    try {
      // Fetch the sidebar HTML from the components folder
      const res = await fetch("/components/sidebar/sidebar.html");
      const html = await res.text();
  
      // Inject the sidebar into the <aside> element
      const nav = document.querySelector("nav");
      nav.innerHTML = html;

      // When the sidebar is loaded, give the nav a padding as well so that the main content is on the right side
      nav.style.paddingRight = "250px";
  
      // Attach event listeners to sidebar buttons
      document.querySelectorAll(".sidebar-button-container").forEach(link => {
        link.addEventListener("click", (e) => {
          const page = e.currentTarget.dataset.page;  // Get target page from data attribute

          selectElement(e.currentTarget);             // Highlight the clicked element
          loadPage(page, true);                             // Load selected page
        });
      });
    } catch (error) {
      console.error("❌ Failed to load sidebar:", error);
    }
  }
  
  /**
   * Loads the selected page's HTML content into the <main> element
   * @param {string} page - The name of the page to load (e.g., "dashboard")
   * @param {boolean} inside - From where to load the app (e.g., "inside-app" or "outside-app" folder)
   */
  async function loadPage(page, inside) {
    try {
      let path;

      if (inside == true){
        path = `/main-pages/inside-app/${page}/${page}.html`;
      } else {
        path = `/main-pages/outside-app/${page}/${page}.html`;
      }
      
      const res = await fetch(path);
      const html = await res.text();
  
      // Replace current main content with new content
      document.querySelector("main").innerHTML = html;

      // Loads the style corresponding to the html name
      loadStyle(`${path.replace(".html", ".css")}`);

    } catch (error) {
      console.error(`❌ Failed to load page "${page}":`, error);
    }
  }

  function selectElement(clickedElement) {
    // Remove nav-selected class from all
    document.querySelectorAll(".sidebar-button-container.nav-selected")
    .forEach(el => el.classList.remove("nav-selected"));

    // Add nav-selected to the clicked Element
    clickedElement.classList.add("nav-selected");
  }

  function loadStyle(href) {
    // Remove old page-specific styles
    document.querySelectorAll("link.page-style")?.forEach(link => link.remove());
  
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.className = "page-style";
    link.href = href;
    document.head.appendChild(link);
  }
  