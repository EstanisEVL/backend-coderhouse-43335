import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import cors from "cors";
import handlebars from "express-handlebars";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import __dirname from "./utils.js";
import { NODE_ENV, PORT } from "./config/config.js";
import { swaggerOptions } from "./config/swagger.config.js";
import { setLogger } from "./utils/logger.js";
import initializePassport from "./config/passport.config.js";

// Importación de rutas:
import sessionRoutes from "./routes/session.routes.js";
import userRoutes from "./routes/user.routes.js";

// Variables globales:
const app = express();
const PORT_APP = Number(PORT) || 8080;

// Middlewares globales:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(setLogger);

// Handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Passport:
initializePassport();
app.use(passport.initialize());

// Swagger specs:
const specs = swaggerJSDoc(swaggerOptions);

// Creación de rutas:
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Levantando el servidor:
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on PORT: ${PORT_APP} || Environment: ${NODE_ENV}`);
});
