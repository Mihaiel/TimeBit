const api = {
    async fetch(url, options = {}) {
        const token = localStorage.getItem('token');
        
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(url, { ...options, headers });
            
            if (response.status === 401) {
                const newToken = await this.refreshToken();
                if (newToken) {
                    headers.Authorization = `Bearer ${newToken}`;
                    return fetch(url, { ...options, headers });
                }
            }
            
            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            // Use safeLoadPage instead of window.location.href
            safeLoadPage("login", false);
            return null;
        }

        try {
            const response = await fetch('/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                return data.token;
            } else {
                localStorage.clear();
                // Use safeLoadPage instead of window.location.href
                safeLoadPage("login", false);
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            localStorage.clear();
            // Use safeLoadPage instead of window.location.href
            safeLoadPage("login", false);
            return null;
        }
    }
};

export default api; 