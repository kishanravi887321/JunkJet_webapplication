import { Router } from "express";
import { chatbot, getSessionInfo, clearSession, getSessionAnalytics } from "../chatbot/index.js"
import { checkValidPrompt } from "../middlewares/chekvalidprompt.middlewares.js";

const router = Router()

// Main chatbot query route
router.route("/chatbotquery").post(chatbot)

// Session management routes
router.route("/session/:userId").get(getSessionInfo)
router.route("/session/:userId").delete(clearSession)
router.route("/sessions/analytics").get(getSessionAnalytics)

export { router }