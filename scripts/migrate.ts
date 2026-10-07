import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env" });

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle({ client: sql });

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "drizzle",
    });
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();