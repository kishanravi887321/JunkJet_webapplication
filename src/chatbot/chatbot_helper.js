
  let previous_prompt=""
  ///  this function is for make the interaction with the GEMINI_API
  const getGeminiResponse = async (userInput) => {
    const API_KEY = "AIzaSyCJaVeBmNwFtbt5MqrCeqdPNyyJJfJsJ-8"; // Replace with your actual API key

    console.log(userInput,API_KEY)

    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    
    const newInput =description_about_the_chatbot(previous_prompt)+userInput
  
    // previous_prompt+=`,${userInput}`;

    
  console.log(previous_prompt)
    

    try {
    
      const requestBody = {
        contents: [
          { parts: [{ text: newInput }] }
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

    let x;
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        x=data.candidates[0].content.parts.map(part => part.text).join('');
      }
      console.log("Response from Gemini:", x);
      return x

    
    } catch (error) {
      console.error("Error:", error.message);
      return "Sorry, I couldn't process your request.";
    }
  };

  //// this function is used for the descripton what is the purpose
  //  of the this chatbot and also for consideration 
  function description_about_the_chatbot(previous_prompt) {
    const x = `Hey! This is a response from a web application powered by a chatbot called JunkJet. 
  The chatbot helps users interact with a platform designed for buying and selling waste materials.

  **User Types:**

  * **Phase 1:** Sellers who are individuals selling waste materials directly from their homes.
  * **Phase 2:** Middle buyers who purchase waste materials from Phase 1 sellers and Phase 3 sellers and resell them.
  * **Phase 3:** Large organizations or industries that buy waste materials in bulk from Phase 2 buyers.

  **User Interactions:**

  * Users can specify the type of waste they are looking for. Guide them to provide clear details.
  * The chatbot should handle conversations contextually, remembering previous interactions. If the conversation becomes too long, inform the user to start a new session.
  * **New Functionality - Location Query:**
      * If the user wants to find sellers/buyers, ask them to specify the location:
          * "From your current location" (response:FalseFlag1234) 
          * "From your home location/default" (response:TrueFlag1234)
      *"not use the TrueFlag or FalseFlag during conversation  . Simply responed in one word TrueFlag1234 or FalseFlag1234 because i am going  
      to use your reponse as a pointer to my function calling and not repetitive give the flag respone because i adding the previus
      prompt so it maybe confused you ensure that if the users gives you happy reaction it means they are satisfied"
      * These are internal flags for the chatbot to determine the location source. 
      * Based on the flag, the chatbot will then query the database for nearby sellers/buyers.

  **General Guidelines:**

  * API requests do not retain previous data. The chatbot should use the previous and current prompts to understand the user's intent.
  * Each query is separated by a comma: **previousPrompt --> newPrompt**.
  * Do not provide internal details about the database or the chatbot's functionality to the user.
  * Write concise and informative responses, using emojis sparingly.

  `;

    return x;  // Return the chatbot's response
  }

getGeminiResponse("my name is kishan and i am looking for a buyer for my waste material").then(response => {
    console.log("Gemini Response:", response);
  }).catch(error => {
    console.error("Error fetching Gemini response:", error);
  });
  // export {getGeminiResponse};


