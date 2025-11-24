
import { Client } from "pg";
import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env");
config({ path: envPath });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Error: DATABASE_URL is not set in your .env file."
      +
      "\n" +
      "Please make sure your .env file exists in the project root and contains:"
      +
      "\n" +
      'DATABASE_URL="postgresql://user:password@host:port/dbname"'
  );
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to the database.");
    const res = await client.query("SELECT NOW()");
    console.log("✅ Successfully executed a query. Current time from DB:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
  } finally {
    await client.end();
  }
}

checkDatabase();
