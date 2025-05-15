window.pageInit = function () {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (!toggleButton || !sidebar) {
        console.warn('Sidebar or toggle button not found');
        return;
    }

    function handleResize() {
        if (window.innerWidth > 999) {
            sidebar.classList.remove('big');
            toggleButton.classList.remove('active');
            toggleButton.style.display = 'none';
        } else {
            toggleButton.style.display = '';
        }
    }

    // Call once on load
    handleResize();

    // Call again on resize
    window.addEventListener('resize', handleResize);

    // Button toggle
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('big');
        toggleButton.classList.toggle('active');
    });
};
