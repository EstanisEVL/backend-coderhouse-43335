// Importación de librerías:
import express from "express";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import session from "express-session";
import displayRoutes from "express-routemap";
import mongoStore from "connect-mongo";
import passport from "passport";
// Importación de utils:
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
// Importación de rutas:
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/sessions.routes.js";

// Variables de entorno:
const app = express();
const PORT = 8080;
const MONGO_URL =
  "mongodb+srv://estanislaovl:AGqTG7UAgI5ZaU3W@ecommerce.jmbjtvw.mongodb.net/?retryWrites=true&w=majority";

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 3600,
    }),
    secret: "secretSession",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport:
initializePassport();
app.use(passport.initialize())


// Handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

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
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);

// Levantar el servidor:
app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Listening on PORT: ${PORT}`);
});