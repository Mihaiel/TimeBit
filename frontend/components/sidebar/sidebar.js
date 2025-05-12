window.pageInit = function() {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const logoutButton = document.querySelector('.logout-button');

    // Automatically show sidebar on large screens


    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('big');
        toggleButton.classList.toggle('active'); // Toggles the X symbol
    });

    // Optional: Listen to resize events to dynamically update
    window.addEventListener('resize', () => {
        if (window.innerWidth > 999) {
            sidebar.classList.remove('big');
            toggleButton.classList.remove('active'); // Reset the X on resize
        }
    });

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
                safeLoadPage("login", false);
            }
        });
    }
};