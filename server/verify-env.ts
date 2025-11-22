import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env");
config({ path: envPath });

const connectionString = process.env.DATABASE_URL;

console.log("========================================");
console.log("Verifying .env file...");
console.log("========================================");

if (connectionString && connectionString.length > 0) {
  console.log("✅ SUCCESS: DATABASE_URL is set in your .env file.");
} else {
  console.error("❌ ERROR: DATABASE_URL is NOT set in your .env file.");
  console.error(
    "Please make sure your .env file exists and contains a line like:"
  );
  console.error('DATABASE_URL="postgresql://user:password@host:port/dbname"');
}

console.log("========================================");
