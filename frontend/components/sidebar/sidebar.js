window.pageInit = function() {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

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
};