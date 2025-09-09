import { Router } from "express";
import { chatbot, getSessionInfo, clearSession, getSessionAnalytics } from "../chatbot/index.js"
import { checkValidPrompt } from "../middlewares/chekvalidprompt.middlewares.js";
import { verifyToken } from "../middlewares/verifyjwtToken.middlewares.js";

const router = Router()

// Main chatbot query route
router.route("/chatbotquery").post(verifyToken,chatbot)

// Session management routes
router.route("/session/:userId").get(verifyToken,getSessionInfo)
router.route("/session/:userId").delete(verifyToken,clearSession)
router.route("/sessions/analytics").get(verifyToken,getSessionAnalytics)

export { router }