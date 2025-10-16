import type { HttpMethod } from "@/types";

type LogType = "log" | "info" | "warn" | "error" | "success" | "request";

class Log {
  private static colorMap: Record<LogType, string> = {
    log: "\x1b[37m", // white
    info: "\x1b[36m", // cyan
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    success: "\x1b[32m", // green
    request: "\x1b[35m", // magenta
  };

  private static reset = "\x1b[0m";

  static log(data: unknown, tag: string = "LOG") {
    this.print("log", data, tag);
  }

  static info(data: unknown, tag: string = "INFO") {
    this.print("info", data, tag);
  }

  static warn(data: unknown, tag: string = "WARN") {
    this.print("warn", data, tag);
  }

  static error(data: unknown, tag: string = "ERROR") {
    this.print("error", data, tag);
  }

  static success(data: unknown, tag: string = "SUCCESS") {
    this.print("success", data, tag);
  }

  static request(method: HttpMethod, url: string) {
    const color = this.getMethodColor(method);
    const upperMethod = method.toUpperCase();
    console.log(
      `${color}%s${this.reset} %s`,
      `[${upperMethod}]`,
      `Request to: ${url}`
    );
  }

  private static print(type: LogType, data: unknown, tag: string) {
    const color = this.colorMap[type] || this.colorMap.log;

    if (typeof data === "object" && data !== null) {
      // For objects and arrays: pretty-print JSON with colorized tag prefix
      console.log(`${color}[${tag}]${this.reset} %O`, data);
    } else {
      // For strings, numbers, booleans, etc.
      console.log(`${color}[${tag}]${this.reset} %s`, String(data));
    }
  }

  private static getMethodColor(method: HttpMethod): string {
    const m = method.toUpperCase();
    if (m === "GET") return "\x1b[32m"; // green
    if (m === "POST") return "\x1b[36m"; // cyan
    if (m === "PUT") return "\x1b[33m"; // yellow
    if (m === "DELETE") return "\x1b[31m"; // red
    return "\x1b[35m"; // magenta for other methods
  }
}

export { Log };
