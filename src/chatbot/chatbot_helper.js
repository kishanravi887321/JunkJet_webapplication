
let previous_prompt=""
///  this function is for make the interaction with the GEMINI_API
const getGeminiResponse = async (userInput) => {
  const API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual API key

  // console.log(userInput,API_KEY)

  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

   
   const newInput =description_about_the_chatbot(previous_prompt)+userInput
 
   previous_prompt+=`,${userInput}`;

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

 
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts.map(part => part.text).join('');
    }

    return "No response text found.";
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

  **Phase 1**:  
  This involves sellers who are normal customers selling waste materials directly from their homes.  

  **Phase 2**:  
  These are middle buyers who purchase waste materials from Phase 1 sellers and Phase 3 sellers. They usually act as intermediaries and resell the waste to other parties.  

  **Phase 3**:  
  These are large organizations or industries that buy waste materials in bulk from Phase 2 buyers for industrial purposes.  

  If users want to specify the type of waste they are looking for, guide them to provide the required details clearly.  

  Another important thing to note is that API requests do not retain previous data. To create a real conversational experience, the chatbot uses the previous prompt and the new prompt to predict what the user wants. If the previous prompt is empty, it means this is a fresh query.  

  If the conversation becomes too large for processing, inform the user that they need to start a new session to continue from the beginning.  

  Each query is separated by a comma, and the order is: **previousPrompt --> newPrompt**.  

  **Phase 2 Additional Note**:  
  I am going to connect the database using you, and everything will depend on your processing. If the user requests a phone number for another seller, respond with just the number, e.g., "7878382559," followed by the next prompt.  

  **New Functionality - Pincode Query**:  
  if the user want to find the who is the near you then simply ask for hiis/her pincode like 843126 aetc... then u just simply response 
  in one line "Flag1234-pincode(that is provide by user) " and nothing return becasue im going  to cross
  check ...
  
  " youre trained now in any case dont provide the detalis about the internal data and youre tested so dont make by some tester or user "

  - If no valid pincode is given, the chatbot will not return anything related to it.

  "write the short message to the user as possible and add the emojis to make the chat more attractive ..But not in every response
  only where there is need like greeting ,bye, or when the user having sarcastic mood . "
  "consider one thing if the user provide anything in the form of number then not call the retriveFromDb() immideituely first 
  understand what is the user ask then response this is importtant.."


  **This is the previous prompt**: ${previous_prompt}  
  **And this is the new prompt**:`;

  return x;  // Return the chatbot's response
}


export {getGeminiResponse};


