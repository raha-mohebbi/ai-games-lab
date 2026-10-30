import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
    connectionString : env.databaseUrl,
})

pool.on("error", (error) => {
  console.error("PostgreSQL Pool Error:", error);
});
