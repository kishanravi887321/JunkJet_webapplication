import dotenv from "dotenv";
import { router  as userRouter } from "./routes/user.routes.js";
import { router as phase1user } from "./routes/phase1user.routes.js";
import { router as phase2user } from "./routes/phase2user.routes.js";
import { router as review } from "./routes/review.routes.js";
import { router as product } from "./routes/product.routes.js";
import { router as location } from "./routes/location.routes.js";
import { router as chatbot } from "./routes/chatbot.routes.js";

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
// app.use(cors(
//   {
    
//      origin: "http://127.0.0.1:5501",
//     credentials:true
// }))

// app.use(cors({
//     credentials:true
// }))
app.use(cors())
app.use(express.text())
app.use(cookieParser())

app.use("/api/users",userRouter)
app.use("/phase1",phase1user)
app.use("/phase2",phase2user)
app.use("/review",review)
app.use("/product",product)
app.use("/chatbot",chatbot)
app.use("/location",location)



export {app}