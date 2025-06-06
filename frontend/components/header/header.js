import { loadPage } from "../../utils/contentLoader.js";
import { selectElement } from "../../utils/domUtils.js";

async function fetchWeather(){
  try {
    const response = await fetch('http://localhost:3000/api/weather/');
    const data = await response.json();

    const icon = document.querySelector('#weather-icon');
    const temperature = document.querySelector('#weather-temp');

    if (icon && temperature) {
      icon.src = data.icon;
      temperature.textContent = `${Math.round(data.temperature)}°C`;
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

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
    fetchWeather();
    setInterval(fetchWeather, 30 * 60 * 1000); // Wiederhole alle 30 Minuten
};
