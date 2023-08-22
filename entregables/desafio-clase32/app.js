import express from "express";
import displayRoutes from "express-routemap";
import { PORT } from "./src/config/config.js";

// Importación de rutas:
import productRoutes from "./src/routes/product.routes.js";
import testRoutes from "./src/routes/test.routes.js";
import errorHandlerGlobal from "./src/middlewares/error-handler-global.js";

const app = express();
const PORT_APP = PORT || 8080;

// Middlewares globales:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Creación de las rutas:
app.use("/api/products", productRoutes);
app.use("/api/mockingproducts", testRoutes);

// Error handler global:
app.use(errorHandlerGlobal);

// Levantando el servidor:
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Listening on PORT: ${PORT_APP}`);
});
