import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { connectRedis } from "./db/redis.db.js";

dotenv.config({
    path:'./.env'
})

const startServer = async () => {
  try {
    // connect MongoDB
    await connectDB();

    // connect Redis
    await connectRedis();

    // start server after both are connected
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed", err);
  }
};

startServer();