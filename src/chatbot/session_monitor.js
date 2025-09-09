import { redisClient } from "../db/redis.db.js";
import { sessionManager } from "./chatbot_helper.js";

// Session monitoring and management utilities
class SessionMonitor {
    constructor() {
        this.monitoringInterval = null;
        this.checkInterval = 60000; // Check every minute
    }

    // Start monitoring sessions
    startMonitoring() {
        if (this.monitoringInterval) {
            console.log("Session monitoring already running");
            return;
        }

        console.log("🔍 Starting session monitoring...");
        this.monitoringInterval = setInterval(async () => {
            await this.checkActiveSessions();
        }, this.checkInterval);
    }

    // Stop monitoring sessions
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log("⏹️ Stopped session monitoring");
        }
    }

    // Check and report active sessions
    async checkActiveSessions() {
        try {
            const pattern = "chatbot:session:*";
            const keys = await redisClient.keys(pattern);
            
            const activeSessions = keys.length;
            const sessionDetails = [];

            for (const key of keys.slice(0, 10)) { // Limit to first 10 for performance
                const ttl = await redisClient.ttl(key);
                const sessionData = await redisClient.get(key);
                
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    const userId = key.replace('chatbot:session:', '');
                    
                    sessionDetails.push({
                        userId,
                        ttl: Math.round(ttl / 60), // TTL in minutes
                        messageCount: session.messageCount || 0,
                        userType: session.userType,
                        lastActivity: session.lastInteraction,
                        sessionAge: Math.round((new Date() - new Date(session.sessionStart)) / (1000 * 60))
                    });
                }
            }

            if (activeSessions > 0) {
                console.log(`📊 Active sessions: ${activeSessions}`);
                if (sessionDetails.length > 0) {
                    console.table(sessionDetails);
                }
            }

        } catch (error) {
            console.error("Error checking active sessions:", error);
        }
    }

    // Get detailed session analytics
    async getSessionAnalytics() {
        try {
            const sessionKeys = await redisClient.keys("chatbot:session:*");
            const historyKeys = await redisClient.keys("chatbot:history:*");
            
            const analytics = {
                totalActiveSessions: sessionKeys.length,
                totalConversationHistories: historyKeys.length,
                sessionDetails: [],
                summary: {
                    averageSessionLength: 0,
                    totalMessages: 0,
                    userTypes: {},
                    topIntents: {}
                }
            };

            let totalSessionTime = 0;
            let totalMessages = 0;

            for (const key of sessionKeys) {
                const sessionData = await redisClient.get(key);
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    const userId = key.replace('chatbot:session:', '');
                    const ttl = await redisClient.ttl(key);
                    const sessionAge = Math.round((new Date() - new Date(session.sessionStart)) / (1000 * 60));
                    
                    analytics.sessionDetails.push({
                        userId,
                        sessionAge,
                        messageCount: session.messageCount || 0,
                        userType: session.userType,
                        currentIntent: session.currentIntent,
                        remainingTime: Math.round(ttl / 60),
                        preferences: session.preferences
                    });

                    // Update summary statistics
                    totalSessionTime += sessionAge;
                    totalMessages += session.messageCount || 0;
                    
                    if (session.userType) {
                        analytics.summary.userTypes[session.userType] = 
                            (analytics.summary.userTypes[session.userType] || 0) + 1;
                    }
                    
                    if (session.currentIntent) {
                        analytics.summary.topIntents[session.currentIntent] = 
                            (analytics.summary.topIntents[session.currentIntent] || 0) + 1;
                    }
                }
            }

            analytics.summary.averageSessionLength = sessionKeys.length > 0 ? 
                Math.round(totalSessionTime / sessionKeys.length) : 0;
            analytics.summary.totalMessages = totalMessages;

            return analytics;
        } catch (error) {
            console.error("Error getting session analytics:", error);
            return null;
        }
    }

    // Clean up stale sessions manually (backup to Redis TTL)
    async cleanupStaleSessions() {
        try {
            const sessionKeys = await redisClient.keys("chatbot:session:*");
            let cleanedCount = 0;

            for (const key of sessionKeys) {
                const sessionData = await redisClient.get(key);
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    const lastActivity = new Date(session.lastInteraction);
                    const now = new Date();
                    const minutesSinceActivity = (now - lastActivity) / (1000 * 60);

                    // Clean sessions inactive for more than 10 minutes (double the TTL)
                    if (minutesSinceActivity > 10) {
                        const userId = key.replace('chatbot:session:', '');
                        await sessionManager.clearUserSession(userId);
                        cleanedCount++;
                    }
                }
            }

            console.log(`🧹 Cleaned up ${cleanedCount} stale sessions`);
            return { cleanedCount };
        } catch (error) {
            console.error("Error during manual cleanup:", error);
            return { cleanedCount: 0, error: error.message };
        }
    }

    // Get memory usage statistics
    async getMemoryStats() {
        try {
            const info = await redisClient.info('memory');
            const memoryInfo = {};
            
            info.split('\r\n').forEach(line => {
                if (line.includes(':')) {
                    const [key, value] = line.split(':');
                    memoryInfo[key] = value;
                }
            });

            const sessionKeys = await redisClient.keys("chatbot:*");
            
            return {
                redisMemory: memoryInfo,
                chatbotKeysCount: sessionKeys.length,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error getting memory stats:", error);
            return null;
        }
    }
}

// Create and export monitor instance
const sessionMonitor = new SessionMonitor();

export { sessionMonitor, SessionMonitor };
