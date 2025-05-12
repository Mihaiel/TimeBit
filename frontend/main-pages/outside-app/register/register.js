window.pageInit = function() {
    // Buttons
    const registerBack = document.getElementById("register-back");
    const registerForm = document.querySelector(".register-form");

    // Add event listener for the 'Back' button
    registerBack.addEventListener("click", () => safeLoadPage("login", false));

    // Add event listener for the form submission
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission (page reload)
        
        // Get the form data
        const formData = new FormData(registerForm);
        
        // Convert FormData to a plain object
        const data = {
            first_name: formData.get('firstname'),
            last_name: formData.get('lastname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm-password')
        };

        // Make the POST request to the backend '/auth/register' endpoint
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Check if the registration was successful
            const result = await response.json();

            if (response.ok) {
                // If registration is successful, you can display a success message or redirect the user
                alert("Registration successful!");
                // You can optionally redirect to login page
                safeLoadPage("login", false);
            } else {
                // If registration fails, display the error message
                alert(result.message || "Something went wrong during registration.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred while trying to register. Please try again.");
        }
    });
};
