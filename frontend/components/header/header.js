
window.pageInit = function () {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const settingsButtonHeader = document.querySelector('.header-settings-button');
    const settingsButton = document.querySelector('.settings-button');

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

    function hideSidebar(){
        sidebar.classList.remove('big');
        toggleButton.classList.remove('active');
        toggleButton.style.display = '';
        console.log("IT SHOULD BE GONE");
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

    if (settingsButtonHeader) {
      settingsButtonHeader.addEventListener("click", (e) => {
        const page = e.currentTarget.dataset.page;

        // Change the header title based on the page
        const content_title = document.querySelector(".header h1");
        if (content_title) {
          content_title.innerHTML = page.toUpperCase();
        }

        selectElement(settingsButton); // Highlight the clicked element
        safeLoadPage(page, true);
      });
    }
};
