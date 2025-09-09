import { createClient } from "redis";   

const redisClient = createClient({
  url: process.env.REDIS_URL
});

console.log("Redis URL:", process.env.REDIS_URL); // Debugging line

client.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis client connected.....    ");
  }
};
export { client, redisClient };