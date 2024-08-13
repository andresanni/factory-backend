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
  entities: ["src/entity/**/*.ts"],
});

export const testDataSource = new DataSource({
  type:"sqlite",
  database: ":memory:",
  entities: ["src/entity/**/*.ts"],
  synchronize: true,
  logging:false
});