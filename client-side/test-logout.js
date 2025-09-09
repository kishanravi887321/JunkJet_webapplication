// Test logout functionality
async function testLogout() {
    console.log('🔐 Testing Logout Functionality...\n');

    try {
        // First, check if user is logged in
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('userData');
        
        console.log('📋 Before logout:');
        console.log('Access Token:', accessToken ? 'EXISTS' : 'NOT FOUND');
        console.log('Refresh Token:', refreshToken ? 'EXISTS' : 'NOT FOUND');
        console.log('User Data:', userData ? 'EXISTS' : 'NOT FOUND');

        if (!accessToken) {
            console.log('❌ User not logged in. Please login first.');
            return;
        }

        // Test logout API call
        console.log('\n🚪 Calling logout API...');
        const response = await fetch('http://localhost:8000/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Logout Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend logout successful:', data.message);
        } else {
            const error = await response.text();
            console.log('❌ Backend logout failed:', error);
        }

        // Clear tokens manually (like the frontend would do)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');

        console.log('\n📋 After logout:');
        console.log('Access Token:', localStorage.getItem('accessToken') ? 'STILL EXISTS' : 'CLEARED ✅');
        console.log('Refresh Token:', localStorage.getItem('refreshToken') ? 'STILL EXISTS' : 'CLEARED ✅');
        console.log('User Data:', localStorage.getItem('userData') ? 'STILL EXISTS' : 'CLEARED ✅');

        console.log('\n✅ Logout test completed!');

    } catch (error) {
        console.error('❌ Logout test failed:', error);
    }
}

// Run the test
testLogout();
