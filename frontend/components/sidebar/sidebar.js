window.pageInit = function() {
    const logoutButton = document.querySelector('.logout-button');
    
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