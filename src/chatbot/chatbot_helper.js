import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Enhanced conversation memory and context management
let conversationHistory = [];
let userContext = {
  userType: null,
  location: null,
  preferences: {},
  currentIntent: null,
  lastInteraction: null
};

///  Enhanced function for intelligent interaction with GEMINI_API
const getGeminiResponse = async (userInput, userId = null) => {
    const API_KEY = process.env.GEMINI_API_KEY;

    console.log("User Input:", userInput, "API Key Available:", !!API_KEY);

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Enhanced context building with conversation history
    const enhancedPrompt = buildAdvancedContext(userInput, userId);
    
    // Update conversation history
    conversationHistory.push({
      role: 'user',
      content: userInput,
      timestamp: new Date(),
      userId: userId
    });

    console.log("Enhanced Prompt:", enhancedPrompt.substring(0, 200) + "...");

    try {
        const requestBody = {
            contents: [
                { parts: [{ text: enhancedPrompt }] }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            if (response.status === 429) {
                console.error("Rate limit exceeded. Please try again later.");
                return "I'm experiencing high demand right now. Please try again in a few minutes! 🕐";
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let aiResponse = "";
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            aiResponse = data.candidates[0].content.parts.map(part => part.text).join('');
        }

        // Process and enhance the AI response
        const processedResponse = processAIResponse(aiResponse, userInput);
        
        // Update conversation history with AI response
        conversationHistory.push({
            role: 'assistant',
            content: processedResponse,
            timestamp: new Date()
        });

        console.log("AI Response:", processedResponse);
        return processedResponse;

    } catch (error) {
        console.error("Error:", error.message);
        return generateFallbackResponse(userInput);
    }
};

// Advanced context building function
function buildAdvancedContext(userInput, userId) {
    const baseContext = getEnhancedChatbotDescription();
    const conversationContext = getConversationContext();
    const userAnalysis = analyzeUserInput(userInput);
    
    // Update user context based on analysis
    updateUserContext(userAnalysis, userId);
    
    const contextualPrompt = `
${baseContext}

**CONVERSATION CONTEXT:**
${conversationContext}

**CURRENT USER CONTEXT:**
- User Type: ${userContext.userType || 'Unknown'}
- Current Intent: ${userContext.currentIntent || 'General inquiry'}
- Location Preference: ${userContext.location || 'Not specified'}
- Material Interests: ${JSON.stringify(userContext.preferences)}

**CONVERSATION HISTORY (Last 3 interactions):**
${getRecentHistory()}

**CURRENT USER INPUT:**
"${userInput}"

**RESPONSE GUIDELINES:**
1. Be conversational and helpful
2. Remember previous context
3. Guide users through the JunkJet process
4. Ask relevant follow-up questions
5. Use appropriate emojis sparingly
6. If user asks about finding buyers/sellers, determine location preference and respond with appropriate flag
7. Provide specific, actionable advice based on their user type
8. Keep responses concise but informative (max 150 words)

**IMPORTANT FLAGS:**
- If user wants to find connections from their current location → respond with "FalseFlag1234"
- If user wants to find connections from their home/default location → respond with "TrueFlag1234"
- Only use these flags when location-based matching is requested

Respond naturally and helpfully:`;

    return contextualPrompt;
}

// Enhanced chatbot description with more context
function getEnhancedChatbotDescription() {
    return `**JUNKJET PLATFORM OVERVIEW:**

JunkJet is a revolutionary 3-phase waste management ecosystem that connects individuals, middle buyers, and organizations for sustainable waste trading.

**PHASE SYSTEM:**
🏠 **Phase 1 (Household Sellers):** Individuals selling recyclable waste from homes
🏢 **Phase 2 (Middle Buyers):** Businesses that aggregate waste from Phase 1 & 3, process it
🏭 **Phase 3 (Organizations):** Large industries buying processed waste materials

**PLATFORM FEATURES:**
- Smart location-based matching
- Environmental impact tracking
- Secure transaction system
- Rating and review system
- Real-time price discovery
- Waste material categorization
- Carbon footprint calculation

**SUPPORTED MATERIALS:**
- Plastic (PET, HDPE, PVC, etc.)
- Paper & Cardboard
- Metals (Aluminum, Steel, Copper)
- Glass
- Electronics (E-waste)
- Textiles
- Organic waste`;
}

// Analyze user input for intent and context
function analyzeUserInput(input) {
    const lowercaseInput = input.toLowerCase();
    
    const analysis = {
        intent: 'general',
        userType: null,
        materials: [],
        action: null,
        location: null,
        sentiment: 'neutral'
    };

    // Intent detection
    if (lowercaseInput.includes('sell') || lowercaseInput.includes('selling')) {
        analysis.intent = 'selling';
        analysis.userType = 'phase1';
    } else if (lowercaseInput.includes('buy') || lowercaseInput.includes('buying') || lowercaseInput.includes('purchase')) {
        analysis.intent = 'buying';
        analysis.userType = 'phase2';
    } else if (lowercaseInput.includes('find') || lowercaseInput.includes('connect') || lowercaseInput.includes('locate')) {
        analysis.intent = 'finding_connections';
    } else if (lowercaseInput.includes('price') || lowercaseInput.includes('cost') || lowercaseInput.includes('rate')) {
        analysis.intent = 'pricing';
    } else if (lowercaseInput.includes('how') || lowercaseInput.includes('what') || lowercaseInput.includes('explain')) {
        analysis.intent = 'information';
    }

    // Material detection
    const materials = ['plastic', 'paper', 'cardboard', 'metal', 'aluminum', 'steel', 'copper', 'glass', 'electronics', 'e-waste', 'textile', 'organic'];
    materials.forEach(material => {
        if (lowercaseInput.includes(material)) {
            analysis.materials.push(material);
        }
    });

    // Location detection
    if (lowercaseInput.includes('current location') || lowercaseInput.includes('here') || lowercaseInput.includes('nearby')) {
        analysis.location = 'current';
    } else if (lowercaseInput.includes('home') || lowercaseInput.includes('default') || lowercaseInput.includes('registered')) {
        analysis.location = 'home';
    }

    // Sentiment analysis (basic)
    if (lowercaseInput.includes('help') || lowercaseInput.includes('please') || lowercaseInput.includes('thank')) {
        analysis.sentiment = 'positive';
    } else if (lowercaseInput.includes('problem') || lowercaseInput.includes('issue') || lowercaseInput.includes('error')) {
        analysis.sentiment = 'negative';
    }

    return analysis;
}

// Update user context based on analysis
function updateUserContext(analysis, userId) {
    if (analysis.userType) {
        userContext.userType = analysis.userType;
    }
    
    userContext.currentIntent = analysis.intent;
    
    if (analysis.location) {
        userContext.location = analysis.location;
    }
    
    // Update material preferences
    if (analysis.materials.length > 0) {
        analysis.materials.forEach(material => {
            userContext.preferences[material] = (userContext.preferences[material] || 0) + 1;
        });
    }
    
    userContext.lastInteraction = new Date();
}

// Get conversation context summary
function getConversationContext() {
    if (conversationHistory.length === 0) {
        return "This is the start of a new conversation.";
    }
    
    const recentCount = Math.min(conversationHistory.length, 6);
    const recentMessages = conversationHistory.slice(-recentCount);
    
    return `Conversation has ${conversationHistory.length} messages. Recent context focuses on: ${userContext.currentIntent}`;
}

// Get recent conversation history
function getRecentHistory() {
    if (conversationHistory.length === 0) {
        return "No previous conversation history.";
    }
    
    const recent = conversationHistory.slice(-3).map((msg, index) => {
        return `${index + 1}. ${msg.role}: "${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}"`;
    }).join('\n');
    
    return recent;
}

// Process AI response for enhancements
function processAIResponse(response, userInput) {
    // Clean up the response
    let processedResponse = response.trim();
    
    // Handle flag responses
    if (processedResponse.includes('TrueFlag1234') || processedResponse.includes('FalseFlag1234')) {
        return processedResponse.includes('TrueFlag1234') ? 'TrueFlag1234' : 'FalseFlag1234';
    }
    
    // Add contextual enhancements
    if (userContext.currentIntent === 'selling' && !processedResponse.includes('Phase 1')) {
        processedResponse += "\n\n💡 As a Phase 1 seller, you can list your materials and connect with nearby Phase 2 buyers!";
    } else if (userContext.currentIntent === 'buying' && !processedResponse.includes('Phase 2')) {
        processedResponse += "\n\n💡 As a Phase 2 buyer, you can find materials from Phase 1 sellers and Phase 3 organizations!";
    }
    
    return processedResponse;
}

// Generate fallback responses for errors
function generateFallbackResponse(userInput) {
    const analysis = analyzeUserInput(userInput);
    
    const fallbackResponses = {
        selling: "I'd love to help you sell your waste materials! Can you tell me what type of materials you have? 📦",
        buying: "Great! I can help you find waste materials to purchase. What specific materials are you looking for? 🔍",
        finding_connections: "I can help you find buyers or sellers! Would you like to search from your current location or your registered home address? 📍",
        pricing: "Material prices vary by location and quality. What specific material would you like pricing information for? 💰",
        information: "I'm here to help you understand how JunkJet works! What specific aspect would you like to know about? ℹ️",
        general: "Hello! I'm your JunkJet assistant. I can help you buy, sell, or learn about our waste management platform. What can I do for you today? 🌱"
    };
    
    return fallbackResponses[analysis.intent] || fallbackResponses.general;
}

// Clear conversation history (for memory management)
function clearConversationHistory() {
    conversationHistory = [];
    userContext = {
        userType: null,
        location: null,
        preferences: {},
        currentIntent: null,
        lastInteraction: null
    };
}

// Export enhanced functions
export { 
    getGeminiResponse, 
    clearConversationHistory, 
    userContext as getCurrentUserContext 
};


