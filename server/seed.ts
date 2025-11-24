import { db } from "./db";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding database...");

  // 1. Create default roles if they don't exist
  const defaultRoles = [
    { nombreRol: "CentroComercialAdmin", permisos: {} },
    { nombreRol: "LocalOwner", permisos: {} },
    { nombreRol: "VisitanteExterno", permisos: {} },
    { nombreRol: "SystemDeveloper", permisos: {} },
  ];

  for (const roleData of defaultRoles) {
    const existing = await db.query.roles.findFirst({
      where: eq(schema.roles.nombreRol, roleData.nombreRol),
    });

    if (!existing) {
      await db.insert(schema.roles).values(roleData);
      console.log(`  -> Created role: ${roleData.nombreRol}`);
    } else {
      console.log(`  -> Role ${roleData.nombreRol} already exists. Skipping.`);
    }
  }

  // 2. Create a default shopping center if it doesn't exist
  let centroComercial = await db.query.centrosComerciales.findFirst({
    where: eq(schema.centrosComerciales.nombre, "CC REDOMA"),
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

  // 3. Define example commercial spaces
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
      fotosUrls: ["https://placehold.co/600x400/EEE/31343C?text=Local+A-101"],
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
      fotosUrls: ["https://placehold.co/600x400/EEE/31343C?text=Local+B-205"],
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
        sala_espera: true,
      },
      fotosUrls: ["https://placehold.co/600x400/EEE/31343C?text=Local+C-110"],
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
        doble_altura: true,
        salidas_emergencia: 2,
      },
      fotosUrls: ["https://placehold.co/600x400/EEE/31343C?text=Local+D-301"],
      rentaMensual: "5500.00",
    },
  ];

  // 4. Insert the example spaces
  console.log("Inserting example commercial spaces...");
  for (const local of localesDeEjemplo) {
    // Check if local already exists by codigoLocal
    const existing = await db.query.localesComerciales.findFirst({
      where: eq(schema.localesComerciales.codigoLocal, local.codigoLocal!),
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
