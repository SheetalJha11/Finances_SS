import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
 export const sql = neon(process.env.DATABASE_URL!);
 const databaseUrl = process.env.DATABASE_URL;
 if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}
export const db = drizzle({ client: sql ,});