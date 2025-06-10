document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector(".login-form");

    if (!form) {
        console.error("Login form not found in admin.js");
        return; 
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;

        if (email === "admin@timebit.com" && password === "binaerenbaeren!2025") {
            try {
                // Redirect to the admin inside page
                const response = await fetch("/admin-page/adminInside.html");
                const htmlText = await response.text();

                // Temporary-DOM creation
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = htmlText;

                // Replace the current document's body with the new content
                const newMain = tempDiv.querySelector("main");
                const currentMain = document.querySelector("main");

                // Clear the current main content
                if (newMain && currentMain) {
                    currentMain.replaceWith(newMain);

                    // Load the adminInside.js dynamically
                    const script = document.createElement("script");
                    script.type = "module";
                    script.src = "adminInside.js";
                    document.body.appendChild(script);
                }
            } catch (error) {
                console.error("Error loading the admin panel", error);
                alert("Failed to load admin page. Please try again later.");
            } 
        } else {
            alert("Invalid email or password. Please try again.");
        }
    });
});