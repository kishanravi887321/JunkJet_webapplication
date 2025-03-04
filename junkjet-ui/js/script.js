document.addEventListener("DOMContentLoaded", () => {
    const termsModal = document.getElementById("terms-modal");
    const agreeCheckbox = document.getElementById("agree-terms");
    const acceptButton = document.getElementById("accept-terms");

    // Check if user is logged in and if terms were accepted
    const isUserLoggedIn = localStorage.getItem("junkjet_user_logged_in"); // Example check
    const hasAcceptedTerms = localStorage.getItem("junkjet_terms_accepted");

    // Show terms modal only if the user hasn't accepted yet & is logged in
    if (!hasAcceptedTerms && isUserLoggedIn && termsModal) {
        termsModal.style.display = "flex";
        agreeCheckbox.checked = false;
        acceptButton.disabled = true;
    }

    // Handle checkbox change
    if (agreeCheckbox && acceptButton) {
        agreeCheckbox.addEventListener("change", function () {
            acceptButton.disabled = !this.checked;
        });

        // Accept terms and save to localStorage
        acceptButton.addEventListener("click", () => {
            if (agreeCheckbox.checked) {
                localStorage.setItem("junkjet_terms_accepted", "true");
                termsModal.style.display = "none";
            }
        });
    }

    // Sidebar toggle
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const sidebarContent = document.querySelector(".sidebar-content");

    if (sidebarToggle && sidebarContent) {
        sidebarToggle.addEventListener("click", function () {
            sidebarContent.classList.toggle("active");
            const icon = this.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-chevron-down");
                icon.classList.toggle("fa-chevron-up");
            }
        });
    }

    // Logout: Reset terms acceptance (you should call this function on logout)
    function logoutUser() {
        localStorage.removeItem("junkjet_terms_accepted"); // Reset terms
        localStorage.removeItem("junkjet_user_logged_in"); // Reset login
        window.location.reload(); // Reload page after logout
    }

    // Example: Attach logout function to a button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }
});
