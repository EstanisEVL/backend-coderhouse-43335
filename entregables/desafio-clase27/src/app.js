import express from "express";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import Connection from "./utils/connection.js";
import __dirname from "./utils.js";
import {PORT} from "./config/config.js";
// Importación de rutas:
import sessionRouter from "./routes/session.routes.js";
import viewsRouter from "./routes/views.routes.js";

const app = express();

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser());

// Handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Conección a Mongo Atlas:
const mongoInstance = Connection.getInstance();

// Rutas:
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);

app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Listening on PORT: ${PORT}`);
});