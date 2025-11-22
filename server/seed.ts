
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
  console.log("Seeding database...");

  // 1. Create a default shopping center if it doesn't exist
  let centroComercial = await db.query.centrosComerciales.findFirst({
    where: (table, { eq }) => eq(table.nombre, "CC REDOMA"),
  });

  if (!centroComercial) {
    console.log("Creating default shopping center...");
    const inserted = await db
      .insert(schema.centrosComerciales)
      .values({
        nombre: "CC REDOMA",
        direccion: "123 Main St, Cityville",
        telefono: "555-1234",
        emailContacto: "contacto@mallcentral.com",
      })
      .returning();
    centroComercial = inserted[0];
  }

  if (!centroComercial) {
    console.error("Failed to create or find a shopping center.");
    return;
  }

  console.log(`Using shopping center: ${centroComercial.nombre}`);

  // 2. Define example commercial spaces
  const localesDeEjemplo: (typeof schema.localesComerciales.$inferInsert)[] = [
    {
      centroComercialId: centroComercial.id,
      codigoLocal: "A-101",
      areaM2: "120.50",
      tipoLocal: "tienda",
      piso: "1",
      estado: "disponible",
      caracteristicas: {
        vitrina: "grande",
        iluminacion: "LED",
        acabados: "de lujo",
      },
      fotosUrls: [
        "https://placehold.co/600x400/EEE/31343C?text=Local+A-101",
      ],
      rentaMensual: "2500.00",
    },
    {
      centroComercialId: centroComercial.id,
      codigoLocal: "B-205",
      areaM2: "85.00",
      tipoLocal: "restaurante",
      piso: "2",
      estado: "ocupado",
      caracteristicas: {
        cocina: "equipada",
        terraza: "sí",
        aforo: 50,
      },
      fotosUrls: [
        "https://placehold.co/600x400/EEE/31343C?text=Local+B-205",
      ],
      rentaMensual: "3200.00",
    },
    {
      centroComercialId: centroComercial.id,
      codigoLocal: "C-110",
      areaM2: "60.75",
      tipoLocal: "servicio",
      piso: "1",
      estado: "disponible",
      caracteristicas: {
        mostrador: "amplio",
        "sala_espera": true,
      },
      fotosUrls: [
        "https://placehold.co/600x400/EEE/31343C?text=Local+C-110",
      ],
      rentaMensual: "1800.00",
    },
    {
      centroComercialId: centroComercial.id,
      codigoLocal: "D-301",
      areaM2: "250.00",
      tipoLocal: "entretenimiento",
      piso: "3",
      estado: "en_mantenimiento",
      caracteristicas: {
        "doble_altura": true,
        "salidas_emergencia": 2,
      },
      fotosUrls: [
        "https://placehold.co/600x400/EEE/31343C?text=Local+D-301",
      ],
      rentaMensual: "5500.00",
    },
  ];

  // 3. Insert the example spaces
  console.log("Inserting example commercial spaces...");
  for (const local of localesDeEjemplo) {
    // Check if local already exists by codigoLocal
    const existing = await db.query.localesComerciales.findFirst({
        where: (table, { eq }) => eq(table.codigoLocal, local.codigoLocal!),
      });

    if (!existing) {
        await db.insert(schema.localesComerciales).values(local);
        console.log(`  -> Inserted local ${local.codigoLocal}`);
    } else {
        console.log(`  -> Local ${local.codigoLocal} already exists. Skipping.`);
    }
  }

  console.log("Database seeding completed successfully!");
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
