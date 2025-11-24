/**
 * Sistema de logging centralizado para el servidor
 */

type LogLevel = "info" | "warn" | "error" | "success" | "debug";

interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(
    message: string,
    options: LogOptions = {}
  ): string {
    const { level = "info", prefix, timestamp = true } = options;
    const time = timestamp
      ? new Date().toISOString().replace("T", " ").substring(0, 19)
      : "";
    const prefixStr = prefix ? `[${prefix}]` : "";
    const levelEmoji = this.getLevelEmoji(level);
    const levelStr = level.toUpperCase().padEnd(5);

    if (timestamp && prefix) {
      return `${time} ${levelEmoji} ${levelStr} ${prefixStr} ${message}`;
    } else if (timestamp) {
      return `${time} ${levelEmoji} ${levelStr} ${message}`;
    } else if (prefix) {
      return `${levelEmoji} ${levelStr} ${prefixStr} ${message}`;
    }
    return `${levelEmoji} ${levelStr} ${message}`;
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warn":
        return "⚠️";
      case "debug":
        return "🔍";
      default:
        return "ℹ️";
    }
  }

  info(message: string, options?: Omit<LogOptions, "level">) {
    console.log(this.formatMessage(message, { ...options, level: "info" }));
  }

  success(message: string, options?: Omit<LogOptions, "level">) {
    console.log(this.formatMessage(message, { ...options, level: "success" }));
  }

  warn(message: string, options?: Omit<LogOptions, "level">) {
    console.warn(this.formatMessage(message, { ...options, level: "warn" }));
  }

  error(message: string, error?: unknown, options?: Omit<LogOptions, "level">) {
    const errorMsg =
      error instanceof Error
        ? `${message}: ${error.message}`
        : error
          ? `${message}: ${JSON.stringify(error)}`
          : message;
    console.error(this.formatMessage(errorMsg, { ...options, level: "error" }));
    if (error instanceof Error && this.isDevelopment) {
      console.error(error.stack);
    }
  }

  debug(message: string, options?: Omit<LogOptions, "level">) {
    if (this.isDevelopment) {
      console.log(this.formatMessage(message, { ...options, level: "debug" }));
    }
  }

  api(method: string, path: string, statusCode: number, duration: number) {
    const statusEmoji =
      statusCode >= 500
        ? "❌"
        : statusCode >= 400
          ? "⚠️"
          : statusCode >= 300
            ? "ℹ️"
            : "✅";
    const statusColor =
      statusCode >= 500
        ? "\x1b[31m" // Red
        : statusCode >= 400
          ? "\x1b[33m" // Yellow
          : statusCode >= 300
            ? "\x1b[36m" // Cyan
            : "\x1b[32m"; // Green
    const reset = "\x1b[0m";

    console.log(
      `${statusEmoji} ${statusColor}${method.padEnd(6)}${reset} ${path.padEnd(40)} ${statusColor}${statusCode}${reset} ${duration}ms`
    );
  }
}

export const logger = new Logger();

