import "dotenv/config";
import app from "./app.js";
import { testDatabaseConnection } from "./database/testConnection.js";
import { testRedisConnection } from "./redis/testConnection.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testDatabaseConnection();
await testRedisConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();