import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env");
config({ path: envPath });

console.log("========================================");
console.log("Verifying .env file...");
console.log("========================================");

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT;

let allGood = true;

if (databaseUrl && databaseUrl.length > 0) {
  console.log("✅ SUCCESS: DATABASE_URL is set in your .env file.");
  console.log(`   Value: ${databaseUrl}`);
} else {
  console.error("❌ ERROR: DATABASE_URL is NOT set in your .env file.");
  console.error(
    "Please make sure your .env file exists and contains a line like:"
  );
  console.error('DATABASE_URL="./database.sqlite"');
  allGood = false;
}

if (jwtSecret && jwtSecret.length > 0) {
  if (jwtSecret === "your-secret-key-change-in-production") {
    console.warn("⚠️  WARNING: JWT_SECRET is using the default value.");
    console.warn("   Please change it to a secure random string in production!");
  } else {
    console.log("✅ SUCCESS: JWT_SECRET is set in your .env file.");
  }
} else {
  console.warn("⚠️  WARNING: JWT_SECRET is NOT set. Using default value.");
  console.warn("   Please set it to a secure random string in production!");
}

if (port && port.length > 0) {
  console.log(`✅ SUCCESS: PORT is set to ${port}.`);
} else {
  console.log("ℹ️  INFO: PORT is not set. Will use default port 5000.");
}

console.log("========================================");

if (allGood) {
  console.log("✅ All required environment variables are set!");
  process.exit(0);
} else {
  console.error("❌ Some required environment variables are missing.");
  process.exit(1);
}
