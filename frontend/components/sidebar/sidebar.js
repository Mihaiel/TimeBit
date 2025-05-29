import { loadPage } from '../../utils/contentLoader.js';
import { selectElement } from '../../utils/domUtils.js';

window.pageInit = function() {
    const logoutButton = document.querySelector('.logout-button');
    const settingsButton = document.querySelector(".settings-button");
    
    // Add logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                // Clear all authentication data
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
        
                // Call logout endpoint
                await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
        
                // Refresh the page
                location.href = location.href;
            } catch (error) {
                console.error('Error during logout:', error);
                // Even if there's an error, clear local storage and redirect
                localStorage.clear();
                loadPage("login", false);
            }
        });
    }

    if (settingsButton) {
      settingsButton.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;

        // Change the header title based on the page
        const content_title = document.querySelector(".header h1");
        if (content_title) {
          content_title.innerHTML = page.toUpperCase();
        }

        selectElement(e.currentTarget); // Highlight the clicked element
        loadPage(page, true); // Load the corresponding page
        hideSidebar();
      });
    }
};