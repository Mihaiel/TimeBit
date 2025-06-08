import { loadPage } from "../../../utils/contentLoader.js";

window.pageInit = function () {
    const backButton = document.querySelector(".button-black");

    if (backButton) {
        backButton.addEventListener("click", function () {
            loadPage("projects-overview");
        });
    }
};