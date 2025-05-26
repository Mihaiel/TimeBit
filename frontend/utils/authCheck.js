import { loadPage } from './contentLoader.js';

/**
 * @returns {boolean} - Returns true if the user is authenticated, otherwise redirects to the login page.
 */
export function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        loadPage("login", false);
        return false;
    }
    return true;
}