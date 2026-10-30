import { redisClient } from "./redisClient.js";

export async function testRedisConnection() {
  try {
    await redisClient.connect();

    const result = await redisClient.ping();

    if (result !== "PONG") {
      throw new Error("Redis health check failed");
    }

    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Redis connection error:", err);
    throw err;
  }
}