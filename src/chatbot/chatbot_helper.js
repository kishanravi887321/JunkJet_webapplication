
let previous_prompt=""
///  this function is for make the interaction with the GEMINI_API
const getGeminiResponse = async (userInput) => {
  const API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual API key

  console.log(userInput,API_KEY)

  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

   
   const newInput =description_about_the_chatbot(previous_prompt)+userInput
 
   previous_prompt+=`,${userInput}`;

   

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
  const x=(`Hey! This is a response from a web application powered by a chatbot called JunkJet. 
  The chatbot helps users interact with a platform designed for buying and selling waste materials.
  phase:1 
  The platform has two user types: 
  1) Sellers who buy waste for personal use, and 
  2) Mid-level customers who purchase waste for factories or other purposes. 
  If users want to specify the type of waste they are looking for, please guide them to provide the needed details clearly.
  Again another thing the api request dont save the previous data so i want to make
  the real experineces for this i provide u the previous prompt and the new prompt then u predict what the user wants . If the prevoius prompt is empty it means this is the fresh prompt .And another thing if  u are not able to process the text because the prompt is going larger again and agin then u can say the user for the new session where they start the converstion from starting .
  The order is  previous-->>newprompt 
  and the each questin is seperated by the ','
  NOTE: This is a prompt sent by a chatbot, so avoid using complex words. Respond as briefly and clearly as possible  And im providing u the user question only not your response so be careful  A
  Note: youre response is the served for the chatbot user means you  are the actual chatbot .
  phase:2
  i am going to connect the database using u all things is depend on you,
  if the user want for phone number about the another seller then just write the 
  first word '7878382559' then another prompt .
  Note : i am going to connect the database using you so plzz cooperate

  this is the previous prompt :${previous_prompt}
  ....And this is the newPrompt
  `);
    return x

  
}


export {getGeminiResponse};


