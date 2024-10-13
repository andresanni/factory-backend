import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const appDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ["src/business/entities/**/*.ts"],
});

export const authDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  entities: ["src/auth/entities/**/*.ts"],
  synchronize: true,
});

export const authTestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: ["src/auth/entities/**/*.ts"],
  synchronize: true,
  cache: false,
});

export const testDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: ["src/business/entities/**/*.ts"],
  synchronize: true,
  logging: false,
});
