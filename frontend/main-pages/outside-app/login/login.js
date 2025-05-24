import { loadPage } from '../../../utils/contentLoader.js';
import { loadMainScreen } from '../../../app.js';

function waitForGoogle(callback) {
    if (window.google && window.google.accounts && window.google.accounts.id) {
        callback();
    } else {
        const interval = setInterval(() => {
            if (window.google && window.google.accounts && window.google.accounts.id) {
                clearInterval(interval);
                callback();
            }
        }, 50);
    }
}

window.pageInit = async function () {
    const loginButton = document.querySelector(".login-button");
    const signUp = document.getElementById("sign-up");

    // Switch to register
    if (signUp) {
        signUp.addEventListener("click", () => loadPage("register", false));
    }

    // Regular login
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    loadMainScreen();
                } else {
                    alert(data.message || "Login failed!");
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert("An error occurred. Please try again later.");
            }
        });
    }

    // Google Sign-In Setup
    try {
        const configResponse = await fetch('/auth/google-client-id');
        const { clientId } = await configResponse.json();

        waitForGoogle(() => {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response) => {
                    try {
                        const authResponse = await fetch('/auth/google', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: response.credential })
                        });

                        const result = await authResponse.json();

                        if (authResponse.ok) {
                            localStorage.setItem('token', result.token);
                            localStorage.setItem('refreshToken', result.refreshToken);
                            localStorage.setItem('user', JSON.stringify(result.user));
                            loadMainScreen();
                        } else {
                            throw new Error(result.message || 'Google authentication failed');
                        }
                    } catch (error) {
                        console.error('Google auth error:', error);
                        alert('Failed to authenticate with Google');
                    }
                }
            });

            google.accounts.id.renderButton(
                document.getElementById("google-signin"),
                { theme: "outline", size: "large" }
            );
        });
    } catch (err) {
        console.error('Failed to initialize Google Sign-In:', err);
        alert('Google Sign-In failed to initialize.');
    }
};
