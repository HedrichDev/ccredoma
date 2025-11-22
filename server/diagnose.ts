
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), ".env");
const result = config({ path: envPath });

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Error: DATABASE_URL is not set in your .env file." +
      "\n" +
      "Please make sure your .env file exists in the project root and contains:" +
      "\n" +
      'DATABASE_URL="postgresql://user:password@host:port/dbname"'
  );
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Running database diagnostics...");
  console.log("=================================");

  // 1. Check Roles and Permissions
  console.log("\nRoles and Permissions:");
  console.log("------------------------");
  try {
    const roles = await db.query.roles.findMany();
    if (roles.length === 0) {
      console.log("No roles found in the database.");
    } else {
      roles.forEach((rol) => {
        console.log(`- Role: ${rol.nombreRol}`);
        console.log(`  Permissions: ${JSON.stringify(rol.permisos, null, 2)}`);
      });
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
  }

  // 2. Check Shopping Centers
  console.log("\nShopping Centers:");
  console.log("-------------------");
  try {
    const centros = await db.query.centrosComerciales.findMany();
    if (centros.length === 0) {
      console.log("No shopping centers found.");
    } else {
      centros.forEach((centro) => {
        console.log(`- Name: ${centro.nombre} (ID: ${centro.id})`);
        console.log(`  Address: ${centro.direccion}`);
      });
    }
  } catch (error) {
    console.error("Error fetching shopping centers:", error);
  }

  // 3. Check Commercial Spaces
  console.log("\nCommercial Spaces (Locales):");
  console.log("------------------------------");
  try {
    const locales = await db.query.localesComerciales.findMany({
      with: {
        centroComercial: {
          columns: {
            nombre: true,
          },
        },
      },
    });
    if (locales.length === 0) {
      console.log("No commercial spaces found.");
    } else {
      locales.forEach((local) => {
        console.log(
          `- Code: ${local.codigoLocal} (Status: ${local.estado})`
        );
        console.log(
          `  Center: ${local.centroComercial?.nombre || "N/A"}`
        );
        console.log(
          `  Type: ${local.tipoLocal}, Area: ${local.areaM2} m², Rent: $${local.rentaMensual}`
        );
      });
    }
  } catch (error) {
    console.error("Error fetching commercial spaces:", error);
  }

  // 4. Check Users
  console.log("\nUsers:");
  console.log("----------");
  try {
    const users = await db.query.usuarios.findMany({
      with: {
        rol: {
          columns: {
            nombreRol: true,
          },
        },
      },
    });
    if (users.length === 0) {
      console.log("No users found.");
    } else {
      users.forEach((user) => {
        console.log(`- Email: ${user.email} (ID: ${user.id})`);
        console.log(`  Role: ${user.rol?.nombreRol || "N/A"}`);
        console.log(`  Personal Data: ${JSON.stringify(user.datosPersonales)}`);
        console.log(`  Status: ${user.estado}`);
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  console.log("\n=================================");
  console.log("Diagnostics complete.");
}

main().catch((err) => {
  console.error("\nError running diagnostics:", err);
  process.exit(1);
});
