import dotenv from "dotenv";
import { router  as userRouter } from "./routes/user.routes.js";
import { router as phase1user } from "./routes/phase1user.routes.js";
import { router as phase2user } from "./routes/phase2user.routes.js";

dotenv.config({
    path:'./env'
})


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// 
// Middleware
app.use(express.json());
app.use("/api/users",userRouter)
app.use("/phase1",phase1user)
app.use("/phase2",phase2user)



export {app}