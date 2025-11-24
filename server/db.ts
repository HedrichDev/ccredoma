import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import { logger } from "./logger";

const dbPath = process.env.DATABASE_URL || "./database.sqlite";
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export async function initializeDatabase() {
  try {
    logger.info(`Conectando a base de datos SQLite: ${dbPath}`, {
      prefix: "DB",
    });

    // Check if roles table exists
    const result = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='roles'")
      .get();

    if (!result) {
      logger.warn("Las tablas de la base de datos no existen aún", {
        prefix: "DB",
      });
      logger.info("Ejecuta: npm run db:push", { prefix: "DB", timestamp: false });
    } else {
      // Get table count
      const tables = sqlite
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )
        .all() as Array<{ name: string }>;

      logger.success(
        `Base de datos conectada exitosamente (${tables.length} tablas)`,
        { prefix: "DB" }
      );
    }
  } catch (error) {
    logger.error("Error al conectar con la base de datos", error, {
      prefix: "DB",
    });
    throw error;
  }
}
