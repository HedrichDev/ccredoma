import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

const dbPath = process.env.DATABASE_URL || "./database.sqlite";
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export async function initializeDatabase() {
  try {
    // Check if roles table exists
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='roles'")
      .get();

    if (!result) {
      console.log("Database tables do not exist yet. Run migrations first.");
      console.log("Run: npm run db:push");
    } else {
      console.log("✓ Successfully connected to SQLite database");
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}
