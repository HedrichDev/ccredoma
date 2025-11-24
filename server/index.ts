import "dotenv/config";
import express, { type Request, Response } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { initializeDatabase } from "./db";
import { logger } from "./logger";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      logger.api(req.method, path, res.statusCode, duration);
    }
  });

  next();
});

(async () => {
  try {
    logger.info("Iniciando servidor CCredoma...", { prefix: "SERVER" });

    // Initialize database
    await initializeDatabase();

    // Create HTTP server first (needed for Vite HMR)
    const { createServer } = await import("http");
    const server = createServer(app);

    // Setup Vite in development or serve static in production
    const isDevelopment = app.get("env") === "development";
    if (isDevelopment) {
      logger.info("Configurando Vite para desarrollo...", { prefix: "SERVER" });
      await setupVite(app, server);
      logger.success("Vite configurado", { prefix: "SERVER" });
    } else {
      logger.info("Sirviendo archivos estáticos...", { prefix: "SERVER" });
      serveStatic(app);
    }

    // Register API routes (after Vite setup)
    logger.info("Registrando rutas de la API...", { prefix: "SERVER" });
    await registerRoutes(app);
    logger.success("Rutas registradas exitosamente", { prefix: "SERVER" });

    // Error handler (must be last)
    app.use((err: Error & { status?: number; statusCode?: number }, _req: Request, res: Response) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      logger.error("Error no manejado en la aplicación", err, {
        prefix: "SERVER",
      });

      res.status(status).json({ message });
    });

    // Start server
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        logger.success(`Servidor iniciado en puerto ${port}`, {
          prefix: "SERVER",
        });
        logger.info(
          `Modo: ${isDevelopment ? "Desarrollo" : "Producción"}`,
          { prefix: "SERVER", timestamp: false }
        );
        logger.info(
          `API disponible en: http://localhost:${port}/api`,
          { prefix: "SERVER", timestamp: false }
        );
        if (isDevelopment) {
          logger.info(
            `Frontend disponible en: http://localhost:${port}`,
            { prefix: "SERVER", timestamp: false }
          );
        }
      }
    );
  } catch (error) {
    logger.error("Error fatal al iniciar el servidor", error, {
      prefix: "SERVER",
    });
    process.exit(1);
  }
})();
