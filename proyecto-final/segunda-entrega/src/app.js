import express from "express";
import mongoose from "mongoose";
import displayRoutes from "express-routemap";
import __dirname from "./utils.js";

// Importar rutas:


// Variables:
const app = express();
const PORT = 8080;
const MONGO_URL = "mongodb+srv://estanislaovl:AGqTG7UAgI5ZaU3W@ecommerce.jmbjtvw.mongodb.net/?retryWrites=true&w=majority";

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Conectar a mongoDb:
const connection = mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("🚀 ~ file: app.js:25 ~ CONECTADO!:");
  })
  .catch((err) => {
    console.log("🚀 ~ file: app.js:28 ~ ERROR:", err);
  });

// Definir rutas:
// app.use("/api/products/", );
// app.use("/api/carts/", );

// Levantar el servidor:
app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`================================`);
  console.log(`🚀 App listening on port: ${PORT}`);
  console.log(`================================`);
})