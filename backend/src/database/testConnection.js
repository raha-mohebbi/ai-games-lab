import { pool } from "./postgres.js";

export async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    throw error;
  }
}