// 📄 Main JavaScript file for FRONTEND behaviour 

// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    loadAdminSidebar();
    loadHeader();
    loadContent("info", false);
  });
  
  /**
  Loads the sidebar HTML into the <nav> element
  and attaches click listeners to all navigation buttons
  */
  async function loadSidebar() {
    try {
      // Fetch the sidebar HTML from the components folder
      const res = await fetch("/components/sidebar/sidebar.html");
      const html = await res.text();
  
      // Inject the sidebar into the <nav> element
      const nav = document.querySelector("nav");
      nav.innerHTML = html;

      // When the sidebar is loaded, give the nav a padding as well so that the main content is on the right side
      nav.style.paddingRight = "250px";

      // Loads the sidebar style
      loadStyle("/components/sidebar/sidebar.css");
  
      // Attach event listeners to sidebar buttons
      document.querySelectorAll(".sidebar-button-container").forEach(link => {
        link.addEventListener("click", (e) => {
          const page = e.currentTarget.dataset.page;  // Get target page from data attribute

          selectElement(e.currentTarget);             // Highlight the clicked element
          if (page == "login" || page == "register")
          {
            loadContent(page, false);                       // Load selected page from outside-app folder
          } else {
            loadContent(page, true);                       // Load selected page from inside-app folder
          }
        });
      });
    } catch (error) {
      console.error("❌ Failed to load sidebar:", error);
    }
  }

    /**
    Loads the ADMIN sidebar HTML into the <nav> element
    and attaches click listeners to all navigation buttons
    */
    async function loadAdminSidebar() {
      try {
        // Fetch the sidebar HTML from the components folder
        const res = await fetch("/components/sidebar-admin/sidebar-admin.html");
        const html = await res.text();
    
        // Inject the sidebar into the <nav> element
        const nav = document.querySelector("nav");
        nav.innerHTML = html;
  
        // When the sidebar is loaded, give the nav a padding as well so that the main content is on the right side
        nav.style.paddingRight = "250px";
  
        // Loads the admin sidebar style
        loadStyle("/components/sidebar-admin/sidebar-admin.css");
    
        // Attach event listeners to sidebar buttons
        document.querySelectorAll(".sidebar-button-container").forEach(link => {
          link.addEventListener("click", (e) => {
            const page = e.currentTarget.dataset.page;        // Get target page from data attribute

            // Changes the header title based off the dataset
            const content_title = document.querySelector(".header h1");
            content_title.innerHTML = page.toUpperCase();
  
            selectElement(e.currentTarget);                   // Highlight the clicked element
            if (page == "login" || page == "register")
            {
              loadContent(page, false);                       // Load selected page from outside-app folder
            } else {
              loadContent(page, true);                       // Load selected page from inside-app folder
            }
          });
        });

        // Attach event listeners to sidebar buttons
        const infoButton = document.querySelector(".info")

        infoButton.addEventListener("click", (e) => {
          const page = e.currentTarget.dataset.page;  // Get target page from data attribute
          loadContent("info", false)
        });

      } catch (error) {
        console.error("❌ Failed to load sidebar:", error);
      }
    }
  
  /**
   * Loads the selected page's HTML content into the <main> element
   * @param {string} page - The name of the page to load (e.g., "dashboard")
   * @param {boolean} inside - From where to load the page (e.g., "inside-app" or "outside-app" folder)
   */
  async function loadContent(page, inside) {
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
      document.querySelector('#main-content').innerHTML = html;

      // Loads the style corresponding to the html name
      loadStyle(`${path.replace(".html", ".css")}`);

    } catch (error) {
      console.error(`❌ Failed to load page "${page}":`, error);
    }
  }

  async function loadHeader() {
    try {
      let path = `/components/header/header.html`;
      
      const res = await fetch(path);
      const html = await res.text();
  
      // Replace current main content with new content
      document.querySelector("main aside").innerHTML = html;

      // Loads the style corresponding to the html name
      loadStyle(`${path.replace(".html", ".css")}`);

    } catch (error) {
      console.error(`❌ Failed to load HEADER: `, error);
    }
  }

  function loadStyle(href) {
    // Load the style into the head of the document
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.className = "page-style";
    link.href = href;
    document.head.appendChild(link);
  }

  function selectElement(clickedElement) {
    // Remove nav-selected class from all
    document.querySelectorAll(".sidebar-button-container.nav-selected")
    .forEach(el => el.classList.remove("nav-selected"));

    // Add nav-selected to the clicked Element
    clickedElement.classList.add("nav-selected");
  }
