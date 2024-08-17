import 'express-async-errors';
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "reflect-metadata";
import { appDataSource } from "./config/data-source";
import { authDataSource } from "./config/data-source";
import supplyRouter from "./business/routes/SupplyRoutes";
import supplyCategoryRouter from "./business/routes/SupplyCategoryRoutes";
import { errorHandler } from "./middleware/errorHandler";
import userRoute from "./auth/routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/supplies", supplyRouter);
app.use("/api/supplyCategories", supplyCategoryRouter); 
app.use("/api/users", userRoute);

app.use(errorHandler);

Promise.all([appDataSource.initialize(), authDataSource.initialize()])
.then(()=>{
  console.log("Conected to databases");
  app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`);
  });
})
.catch((error)=>{
  console.log("Error connecting to database", error);
});


