//  load the .env contents 
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env"

})

import readline from "readline-sync";

import { getGeminiResponse } from './chatbot_helper.js';

//  geminin api callign 
(async ()=>{
  console.log("example of api calling")

  while (true){
    const userInput=readline.question("you==>>")

    if (userInput==='stop')
    break

  const response =await getGeminiResponse(userInput)
  console.log("Example API Respone ",response)

  

  }
})();
