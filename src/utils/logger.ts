import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";
const { combine, errors, printf, colorize } = winston.format;

const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info",
  format: combine(
    errors({ stack: true }),
    colorize(),
    printf((info) => {
      return `${info.level}: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
