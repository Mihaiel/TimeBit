import { loadPage } from "../../utils/contentLoader.js";
import { selectElement } from "../../utils/domUtils.js";

window.pageInit = function () {
    const settingsButtonHeader = document.querySelector('.header-settings-button');
    const settingsButton = document.querySelector('.settings-button');

    if (settingsButtonHeader) {
      settingsButtonHeader.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;

        // Change the header title based on the page
        const content_title = document.querySelector(".header h1");
        if (content_title) {
          content_title.innerHTML = page.toUpperCase();
        }

        selectElement(settingsButton); // Highlight the clicked element
        loadPage(page);
      });
    }
};
