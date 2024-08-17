import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "reflect-metadata";
import { appDataSource } from "./config/data-source";
import { authDataSource } from "./config/data-source";
import supplyRouter from "./business/routes/SupplyRoutes";
import supplyCategoryRouter from "./business/routes/SupplyCategoryRoutes";
import { errorHandler } from "./middleware/errorHandler";
import 'express-async-errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use("/api/supplies", supplyRouter);
app.use("/api/supplyCategories", supplyCategoryRouter); 

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




/*appDataSource.initialize()
  .then(() => {
    console.log("Connnected to database");
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });
*/