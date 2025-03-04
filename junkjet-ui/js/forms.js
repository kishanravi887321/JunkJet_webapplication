// Form Handling and Validation
document.addEventListener('DOMContentLoaded', function() {
    // Phase 1 Form Handling
    const phase1Form = document.getElementById('phase1-form');
    
    if (phase1Form) {
        // Simulate auto-fetching user info
        simulateUserInfoFetch();
        
        // Form submission
        phase1Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validatePhase1Form()) {
                // Show success message
                alert('Form submitted successfully!');
                
                // Reset form
                phase1Form.reset();
                
                // Redirect to dashboard (in a real app)
                // window.location.href = 'index.html';
            }
        });
    }
    
    // Simulate fetching user info
    function simulateUserInfoFetch() {
        const userNameInput = document.getElementById('userName');
        const emailInput = document.getElementById('email');
        const fullNameInput = document.getElementById('fullName');
        
        if (!userNameInput || !emailInput || !fullNameInput) return;
        
        // Simulate API call delay
        setTimeout(() => {
            // Mock user data
            const userData = {
                userName: 'junkjet_user',
                email: 'user@example.com',
                fullName: 'John Doe'
            };
            
            // Populate fields
            userNameInput.value = userData.userName;
            emailInput.value = userData.email;
            fullNameInput.value = userData.fullName;
        }, 1000);
    }
    
    // Validate Phase 1 Form
    function validatePhase1Form() {
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const pincode = document.getElementById('pincode').value;
        const country = document.getElementById('country').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        
        // Basic validation
        if (!phone || !city || !state || !pincode || !country) {
            alert('Please fill in all required fields.');
            return false;
        }
        
        // Phone validation
        if (!/^\d{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return false;
        }
        
        // Pincode validation
        if (!/^\d{5,6}$/.test(pincode)) {
            alert('Please enter a valid pincode (5-6 digits).');
            return false;
        }
        
        // Location validation
        if (!latitude || !longitude) {
            alert('Please get your current location coordinates.');
            return false;
        }
        
        return true;
    }
    
    // Phase 2 Form Handling (if present)
    const phase2Form = document.getElementById('phase2-form');
    
    if (phase2Form) {
        phase2Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form (implement similar to Phase 1)
            alert('Organization form submitted successfully!');
            
            // Reset form
            phase2Form.reset();
        });
    }
    
    // Phase 3 Form Handling (if present)
    const phase3Form = document.getElementById('phase3-form');
    
    if (phase3Form) {
        phase3Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = phase3Form.querySelectorAll('input[type="text"]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                alert('Please fill in all fields.');
                return;
            }
            
            alert('Form submitted successfully!');
            
            // Reset form
            phase3Form.reset();
        });
    }
});