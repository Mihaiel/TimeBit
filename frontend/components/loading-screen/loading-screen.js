export class LoadingScreen {
    constructor() {
        this.overlay = document.getElementById('loadingOverlay');
        if (!this.overlay) {
            this.initializeLoadingScreen();
        }
    }

    initializeLoadingScreen() {
        // Create and append the loading screen HTML
        const loadingHTML = `
            <div class="loading-overlay" id="loadingOverlay">
                <div class="loading-spinner"></div>
            </div>
        `;
        
        // Find the main content section
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            // Make sure main-content has position relative for absolute positioning of overlay
            mainContent.style.position = 'relative';
            
            // Insert the loading screen as the first child of main-content
            mainContent.insertAdjacentHTML('afterbegin', loadingHTML);
            this.overlay = document.getElementById('loadingOverlay');

            // Add the CSS if it's not already loaded
            if (!document.querySelector('link[href*="loading-screen.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/components/loading-screen/loading-screen.css';
                document.head.appendChild(link);
            }
        }
    }

    show() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }
}

// Create a singleton instance
export const loadingScreen = new LoadingScreen(); 