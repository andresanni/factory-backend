import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const authDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  entities: ["src/auth/entities/**/*.{ts,js}"],
  synchronize: true,
});

export const authTestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: ["src/auth/entities/**/*.ts"],
  synchronize: true,
  cache: false,
});
