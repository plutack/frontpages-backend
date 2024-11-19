import pino  from "pino";

const logger =
  process.env["NODE_ENV"] === "production"
    ? // JSON in production
      pino({ level: "info" })
    : // Pretty print in development
      pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });

export default logger;
