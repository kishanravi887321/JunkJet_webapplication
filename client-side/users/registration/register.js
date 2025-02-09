document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const userName = document.getElementById("userName").value.trim();

        // Validate fields
        if (!fullName || !email || !password || !confirmPassword || !userName) {
            alert("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Prepare payload
            const payload = { fullName, email, password, userName };

            // Send the form data to the backend
            const response = await fetch("http://127.0.0.1:4000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // Parse the response
            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Registration failed!");
                return;
            }

            // Show success message
            alert(`user registration successfully completed ${response}`);

            // Display user data
            console.log("Registered User:", result.data);

            // Optionally, redirect or clear the form
            form.reset();
        } catch (error) {
            console.error("Error:", error);
            alert(`something went wrong ${error.message}`);
        }
    });
});
