// 📄 Main JavaScript file for FRONTEND behaviour 

// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    loadSidebar();               // Load the sidebar once on initial load
    loadPage("timesheet");       // Load the default page content (dashboard)
  });
  
  /**
   * Loads the sidebar HTML into the <aside> element
   * and attaches click listeners to all navigation buttons
   */
  async function loadSidebar() {
    try {
      // Fetch the sidebar HTML from the components folder
      const res = await fetch("/components/sidebar.html");
      const html = await res.text();
  
      // Inject the sidebar into the <aside> element
      document.querySelector("nav").innerHTML = html;
  
      // Attach event listeners to sidebar buttons
      document.querySelectorAll(".sidebar-button-container").forEach(link => {
        link.addEventListener("click", (e) => {
          const page = e.currentTarget.dataset.page;  // Get target page from data attribute

          selectElement(e.currentTarget);             // Highlight the clicked element
          loadPage(page);                             // Load selected page
        });
      });
    } catch (error) {
      console.error("❌ Failed to load sidebar:", error);
    }
  }
  
  /**
   * Loads the selected page's HTML content into the <main> element
   * @param {string} page - The name of the page to load (e.g., "dashboard")
   */
  async function loadPage(page) {
    try {
      const res = await fetch(`/pages/${page}.html`);
      const html = await res.text();
  
      // Replace current main content with new content
      document.querySelector("main").innerHTML = html;
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