import { loadPage } from './contentLoader.js';

export function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        loadPage("login", false);
        return false;
    }
    return true;
}