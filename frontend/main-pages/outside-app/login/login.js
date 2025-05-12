window.pageInit = function () {
    const loginButton = document.querySelector(".login-button");
    const signUp = document.getElementById("sign-up");

    if (signUp) {
        signUp.addEventListener("click", () => safeLoadPage("register", false));
    }

    if (loginButton) {
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const email = document.querySelector("input[name='email']")?.value;
            const password = document.querySelector("input[name='password']")?.value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    loadMainScreen();  // Transition to main app
                } else {
                    alert(data.message || "Login failed!");
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert("An error occurred. Please try again later.");
            }
        });
    }
};
