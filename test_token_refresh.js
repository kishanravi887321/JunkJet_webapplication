// Test script for token refresh functionality
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8000';

async function testTokenRefresh() {
    console.log('🔐 Testing Token Refresh Functionality...\n');

    try {
        // Step 1: Login to get tokens
        console.log('📋 Step 1: Login to get access and refresh tokens');
        const loginResponse = await fetch(`${API_BASE}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "kishanravi887321@gmail.com",
                password: "Test@123" // Update with correct password
            })
        });

        if (!loginResponse.ok) {
            const error = await loginResponse.text();
            console.log('❌ Login failed:', error);
            return;
        }

        const loginData = await loginResponse.json();
        const accessToken = loginData.data?.accessToken;
        const refreshToken = loginData.data?.refreshToken;
        
        console.log('✅ Login successful!');
        console.log('Access Token:', accessToken ? accessToken.substring(0, 30) + '...' : 'None');
        console.log('Refresh Token:', refreshToken ? refreshToken.substring(0, 30) + '...' : 'None');

        if (!accessToken || !refreshToken) {
            console.log('❌ Tokens missing in response');
            return;
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Step 2: Test chatbot with valid token
        console.log('📋 Step 2: Test chatbot with valid access token');
        const chatResponse = await fetch(`${API_BASE}/chatbot/chatbotquery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ message: "Hello, test message with valid token" })
        });

        console.log('Chatbot Status:', chatResponse.status);
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('✅ Chatbot response:', chatData.message?.substring(0, 100) + '...');
        } else {
            const error = await chatResponse.text();
            console.log('❌ Chatbot error:', error);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Step 3: Test refresh token endpoint
        console.log('📋 Step 3: Test refresh token endpoint');
        const refreshResponse = await fetch(`${API_BASE}/api/users/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken })
        });

        console.log('Refresh Status:', refreshResponse.status);
        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.data?.accessToken;
            const newRefreshToken = refreshData.data?.refreshToken;
            
            console.log('✅ Token refresh successful!');
            console.log('New Access Token:', newAccessToken ? newAccessToken.substring(0, 30) + '...' : 'None');
            console.log('New Refresh Token:', newRefreshToken ? newRefreshToken.substring(0, 30) + '...' : 'None');

            // Step 4: Test chatbot with new token
            console.log('\n📋 Step 4: Test chatbot with refreshed token');
            const newChatResponse = await fetch(`${API_BASE}/chatbot/chatbotquery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newAccessToken}`
                },
                body: JSON.stringify({ message: "Hello with refreshed token" })
            });

            console.log('New Chatbot Status:', newChatResponse.status);
            if (newChatResponse.ok) {
                const newChatData = await newChatResponse.json();
                console.log('✅ Chatbot with new token:', newChatData.message?.substring(0, 100) + '...');
            } else {
                const error = await newChatResponse.text();
                console.log('❌ Chatbot error with new token:', error);
            }

        } else {
            const error = await refreshResponse.text();
            console.log('❌ Token refresh failed:', error);
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Step 5: Test anonymous chatbot (no token)
        console.log('📋 Step 5: Test anonymous chatbot (no authentication)');
        const anonResponse = await fetch(`${API_BASE}/chatbot/chatbotquery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: "Hello as anonymous user" })
        });

        console.log('Anonymous Chatbot Status:', anonResponse.status);
        if (anonResponse.ok) {
            const anonData = await anonResponse.json();
            console.log('✅ Anonymous chatbot response:', anonData.message?.substring(0, 100) + '...');
        } else {
            const error = await anonResponse.text();
            console.log('❌ Anonymous chatbot error:', error);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }

    console.log('\n✅ Token refresh test completed!');
}

// Run the test
testTokenRefresh().catch(console.error);
