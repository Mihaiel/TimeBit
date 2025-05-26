import { loadStyle, loadScript, fileExists } from './domUtils.js';

/**
 * Safely loads a page by fetching its HTML, CSS, and JS (if available).
 * Handles errors and ensures the page is properly loaded into the main content.
 * @param {string} page - The name of the page to load (e.g., "dashboard", "settings").
 * @param {boolean} inside - Whether the page is part of the inside app tree (default is true).
 */
export async function loadPage(page, inside = true) {
  try {
    const baseDir = inside ? "inside-app" : "outside-app";
    const basePath = `/main-pages/${baseDir}/${page}/${page}`;

    const htmlRes = await fetch(`${basePath}.html`);
    if (!htmlRes.ok) throw new Error(`Page not found: ${page}`);
    const html = await htmlRes.text();

    // STEP 1: Inject HTML
    const container = document.querySelector("#main-content");
    container.innerHTML = html;

    // STEP 2: Load CSS if exists
    if (await fileExists(`${basePath}.css`)) {
        loadStyle(`${basePath}.css`);
    }

    // STEP 3: Load JS if exists
    if (await fileExists(`${basePath}.js`)) {
        await loadScript(`${basePath}.js`);
    }
  } catch (err) {
    console.error(`❌ Failed to load page "${page}":`, err.message);
  }
}


/**  
 * Unloads a page by clearing its content, CSS, and JS.
 * * @param {string} page - The name of the page to unload (e.g., "dashboard", "settings").
 * * @param {boolean} inside - Whether the page is part of the inside app tree (default is true).
 * */

export async function unloadPage(page, inside = true) {
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
