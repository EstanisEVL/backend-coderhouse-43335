import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import { setLogger } from "./utils/logger.js";
import { NODE_ENV, PORT } from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";

// Importación de rutas:
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import testRoutes from "./routes/test.routes.js";

const app = express();
const PORT_APP = PORT || 8080;

// Middlewares globales:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(setLogger);

// Passport:
initializePassport();
app.use(passport.initialize());

// Creación de las rutas:
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/loggerTest", testRoutes);

// Levantando el servidor:
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on ${PORT_APP}, environment: ${NODE_ENV}`);
});

/*
Consigna

Basado en nuestro proyecto principal, implementar un logger

Aspectos a incluir

- Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor): debug, http, info, warning, error, fatal. ✓

- Después implementar un logger para desarrollo y un logger para producción, el logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola. ✓

- Sin embargo, el logger del entorno productivo debería loggear sólo a partir de nivel info. ✓

- Además, el logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”. ✓

SEGUIR ACÁ, PASAR PARTES DEL PROYECTO FINAL PARA PROBAR EL LOGGER:
- Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston. 

- Crear un endpoint /loggerTest que permita probar todos los logs ✓

Sugerencias

La ruta loggerTest es muy importante para que tu entrega pueda ser calificada de manera rápida y eficiente. ¡No olvides colocarla!

Puedes revisar el testing del entregable Aquí:
✓	Se revisará que la estructura del servidor en general esté implementada con el logger de winston.

✓	Se ejecutará el proyecto en entorno de desarrollo y entorno productivo para corroborar que se implementen los diferentes loggers según el entorno.

✓	Se probará un endpoint (proporcionado por el alumno). para revisar que los logs se escriban correctamente, tanto para consola (desarrollo) como para consola y archivos (productivo).

*/
