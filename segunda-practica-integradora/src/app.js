import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";
import displayRoutes from "express-routemap";

// Importar utils:

// Importar passport:
import initializePassport from "./config/passport.config.js";

// Importar rutas:
import sessionRouter from "./routes/session.routes.js"

// Variables de entorno:
const app = express();
const PORT = 8080;
const MONGO_URL =
  "mongodb+srv://estanislaovl:AGqTG7UAgI5ZaU3W@ecommerce.jmbjtvw.mongodb.net/?retryWrites=true&w=majority";

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

// Inicializar passport:
initializePassport();
app.use(passport.initialize());

// Handlebars:

// Conección con Mongo Atlas:
const connection = mongoose
  .connect(MONGO_URL)
  .then((conn) => {
    console.log("CONECTADO!");
  })
  .catch((err) => {
    console.log(err);
  });

// Rutas:
app.use("/api/session/", sessionRouter);

// Levantar el puerto:
app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Listening on PORT: ${PORT}`);
});


/*
Si vas a usar jwt..Tenes que tener en cuenta esto..

(Sin cookies te obliga a usar código en el frontend) porque en todas las peticiones tenes que agregar el token

Si usas cookies es mas facil porque no escribis codigo en el front pero es mas vulnerable.

Con cookie:

Seguí la ppt de la clase 22 que es prácticamente lo que te pide.
*/