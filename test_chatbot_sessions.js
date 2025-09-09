import fetch from 'node-fetch';

// Test script for Redis-based chatbot session management
const API_BASE = 'http://localhost:8000';

class ChatbotTester {
    constructor() {
        this.testUserId = `test_user_${Date.now()}`;
    }

    async sendMessage(message) {
        try {
            const response = await fetch(`${API_BASE}/chatbot/chatbotquery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            console.log(`\n🤖 Bot Response:`, data.message);
            console.log(`📊 Session Info:`, data.sessionInfo);
            return data;
        } catch (error) {
            console.error('❌ Error sending message:', error.message);
            return null;
        }
    }

    async getSessionInfo() {
        try {
            const response = await fetch(`${API_BASE}/chatbot/session/${this.testUserId}`);
            const data = await response.json();
            console.log(`\n📋 Session Details:`, JSON.stringify(data.data, null, 2));
            return data;
        } catch (error) {
            console.error('❌ Error getting session info:', error.message);
            return null;
        }
    }

    async clearSession() {
        try {
            const response = await fetch(`${API_BASE}/chatbot/session/${this.testUserId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log(`\n🧹 Session cleared:`, data.message);
            return data;
        } catch (error) {
            console.error('❌ Error clearing session:', error.message);
            return null;
        }
    }

    async getAnalytics() {
        try {
            const response = await fetch(`${API_BASE}/chatbot/sessions/analytics`);
            const data = await response.json();
            console.log(`\n📊 Global Analytics:`, JSON.stringify(data.data, null, 2));
            return data;
        } catch (error) {
            console.error('❌ Error getting analytics:', error.message);
            return null;
        }
    }

    async runTest() {
        console.log(`🚀 Starting chatbot session test with user: ${this.testUserId}`);
        
        // Test conversation flow
        console.log('\n=== Testing Conversation Flow ===');
        await this.sendMessage("Hello! I want to sell some plastic bottles");
        await this.sendMessage("What materials do you accept?");
        await this.sendMessage("How much do plastic bottles cost?");
        
        // Get session info
        console.log('\n=== Getting Session Information ===');
        await this.getSessionInfo();
        
        // Continue conversation
        console.log('\n=== Continuing Conversation ===');
        await this.sendMessage("Can you find buyers near me?");
        await this.sendMessage("What about from my home location?");
        
        // Get analytics
        console.log('\n=== Getting Analytics ===');
        await this.getAnalytics();
        
        // Test session persistence after some time
        console.log('\n=== Testing Session Persistence ===');
        console.log('Waiting 10 seconds to test session persistence...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        await this.sendMessage("Are you still there?");
        await this.getSessionInfo();
        
        // Clear session
        console.log('\n=== Clearing Session ===');
        await this.clearSession();
        
        // Try to get session info after clearing
        console.log('\n=== Verifying Session Cleared ===');
        await this.getSessionInfo();
        
        console.log('\n✅ Test completed!');
    }
}

// Helper function to wait for server to be ready
async function waitForServer() {
    const maxAttempts = 10;
    let attempt = 0;
    
    while (attempt < maxAttempts) {
        try {
            const response = await fetch(`${API_BASE}/chatbot/sessions/analytics`);
            if (response.ok) {
                console.log('✅ Server is ready!');
                return true;
            }
        } catch (error) {
            console.log(`⏳ Waiting for server... (attempt ${attempt + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        attempt++;
    }
    
    console.log('❌ Server not responding');
    return false;
}

// Run the test
async function main() {
    console.log('🔧 Waiting for server to be ready...');
    const serverReady = await waitForServer();
    
    if (!serverReady) {
        console.log('❌ Cannot connect to server. Make sure it\'s running on port 8000');
        return;
    }
    
    const tester = new ChatbotTester();
    await tester.runTest();
}

// Export for module use or run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { ChatbotTester };
