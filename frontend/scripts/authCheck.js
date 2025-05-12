function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        safeLoadPage("login", false);
        return false;
    }
    return true;
}

// Use this in protected pages
window.pageInit = function() {
    if (!checkAuth()) return;
    // Rest of your page initialization code
}; 