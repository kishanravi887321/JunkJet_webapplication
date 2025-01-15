import { Router } from "express";
import   {chatbot} from "../chatbot/index.js"
import { checkValidPrompt } from "../middlewares/chekvalidprompt.middlewares.js";
const router=Router()

router.route("/chatbotquery").post(checkValidPrompt,chatbot)



export {router}