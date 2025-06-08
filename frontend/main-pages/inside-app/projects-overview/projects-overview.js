import { loadPage } from "../../../utils/contentLoader.js";

window.pageInit = function () {
    const newProjectButton = document.querySelector("button.new-project");

    if (newProjectButton) {
        newProjectButton.addEventListener("click", function () {
            loadPage("projects");
        });
    }
};