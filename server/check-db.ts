import { db, initializeDatabase } from "./db";
import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env");
config({ path: envPath });

async function checkDatabase() {
  try {
    await initializeDatabase();
    console.log("✅ Successfully connected to SQLite database.");
    
    // Try a simple query
    const { roles } = await import("@shared/schema");
    const result = await db.select().from(roles).limit(1);
    console.log("✅ Successfully executed a query.");
    
    if (result.length > 0) {
      console.log("✅ Database contains data.");
    } else {
      console.log("ℹ️  Database is empty. Run 'npm run db:seed' to populate it.");
    }
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
}

checkDatabase();
