
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function testDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
  }

  try {
    const sql = neon(databaseUrl);
    const result = await sql`SELECT 1 AS connected`;

    console.log("Database connection successful:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testDatabase();
