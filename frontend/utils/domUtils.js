export function loadStyle(href) {
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

export function loadScript(src, isModule = true) {
  return new Promise((resolve, reject) => {
    // Remove previously loaded page-specific scripts
    document.querySelectorAll("script.page-script").forEach(script => script.remove());

    const script = document.createElement("script");
    script.src = src;
    script.className = "page-script";
    script.type = isModule ? "module" : "text/javascript";

    script.onload = () => {
      console.log(`${src} loaded`);
      if (typeof window.pageInit === "function") {
        window.pageInit();
      }
      resolve();  // Resolve the promise
    };

    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.body.appendChild(script);
  });
}


/**
 * Checks if a file exists by sending a HEAD request.
 * Returns a promise that resolves to true if the file exists, false otherwise.
 */
export function fileExists(path) {
    return fetch(path, { method: 'HEAD' }).then(res => res.ok).catch(() => false);
}

/**
 * Highlights the clicked navigation button and removes highlight from others.
 * (In the Sidebar)
 */
export function selectElement(clickedElement) {
    // Remove 'nav-selected' class from all elements
    document.querySelectorAll(".sidebar-button-container.nav-selected")
    .forEach(el => el.classList.remove("nav-selected"));

    // Sidebar settings button selected style removal
    document.querySelectorAll(".settings-button.nav-selected")
    .forEach(el => el.classList.remove("nav-selected"));

    // Add 'nav-selected' class to the clicked element
    clickedElement.classList.add("nav-selected");
}