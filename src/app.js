import dotenv from "dotenv";
import { router  as userRouter } from "./routes/user.routes.js";
import { router as phase1user } from "./routes/phase1user.routes.js";
import { router as phase2user } from "./routes/phase2user.routes.js";
import { router as review } from "./routes/review.routes.js";
import { router as product } from "./routes/product.routes.js";
import { router as location } from "./routes/location.routes.js";
import { router as chatbot } from "./routes/chatbot.routes.js";
import  {errorHandler} from "./middlewares/errorhandler.middlewares.js"
import analyticsRouter from "./routes/analytics.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

dotenv.config({
    path:'./env'
})

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Start session monitoring after Redis connection is established
const initializeSessionMonitoring = async () => {
  try {
    // Import session monitor dynamically to ensure Redis is connected
    const { sessionMonitor } = await import("./chatbot/session_monitor.js");
    sessionMonitor.startMonitoring();
    console.log("🔍 Chatbot session monitoring initialized");
  } catch (error) {
    console.error("❌ Failed to initialize session monitoring:", error);
  }
};

// Initialize monitoring with a slight delay to ensure Redis is ready
setTimeout(initializeSessionMonitoring, 2000);

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.text({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Fix CORS configuration
app.use(cors({
  origin: "*",            // allow all domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(express.text())
app.use(cookieParser())

app.use("/api/users",userRouter)
app.use("/phase1",phase1user)
app.use("/phase2",phase2user)
app.use("/review",review)
app.use("/product",product)
// Chatbot route - now handles both JSON and text due to global middleware
app.use("/chatbot", chatbot)
app.use("/location",location)
app.use("/api/analytics",analyticsRouter)
app.use("/api/transactions",transactionRouter)

// Error handler must be placed AFTER all routes
app.use(errorHandler);

export {app}
