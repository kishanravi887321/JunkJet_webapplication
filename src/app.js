import dotenv from "dotenv";
import { router  as userRouter } from "./routes/user.routes.js";

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




export {app}