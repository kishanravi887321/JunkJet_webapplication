document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Get form data
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      // Validate input fields
      if (!email || !password) {
        alert("All fields are required!");
        return;
      }
  
      try {
        const payload = { email, password };
  
        const response = await fetch("http://127.0.0.1:4000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials:"include",
        });
  
        // Handle successful response
        if (response.ok) {
          const data = await response.json();
          alert(`Login successful! Welcome, ${data.userName || "User"}.`);
          // Redirect to a protected page (modify as per your app)
          window.location.href = "/dashboard"; 
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.message || "Invalid email or password."}`);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("Something went wrong. Please try again later.");
      }
    });
  });
  