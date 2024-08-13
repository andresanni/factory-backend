import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "reflect-metadata";
import { appDataSource } from "./data-source";
import supplyRouter from "./routes/SupplyRoutes";
import supplyCategoryRouter from "./routes/SupplyCategoryRoutes";
import { errorHandler } from "./middleware/errorHandler";
import 'express-async-errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use("/api/supplies", supplyRouter);
app.use("/api/supplyCategories", supplyCategoryRouter); 

app.use(errorHandler);

appDataSource.initialize()
  .then(() => {
    console.log("Connnected to database");
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });
