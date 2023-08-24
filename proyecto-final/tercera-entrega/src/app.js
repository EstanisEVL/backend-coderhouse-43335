import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import cors from "cors";
import { PORT } from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";

// Importación de rutas:
import cartRoutes from "./routes/carts.routes.js";
import productRoutes from "./routes/products.routes.js";
import sessionRoutes from "./routes/sessions.routes.js";
import viewsRoutes from "./routes/views.routes.js";

const app = express();
const PORT_APP = PORT || 8080;

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

// Handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Passport:
initializePassport();
app.use(passport.initialize());

// Creación de las rutas:
app.use("/", viewsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);

// Levantando el servidor:
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Listening on ${PORT_APP}`);
});

/*
- Hay detalles que todavía no funcionan: (Son muy de lógica de negocios) lo mas importantes son los de arriba..

    login github
    /profile o /current
    Después de finalizar la compra los productos siguen ahí. 

Todavía  tenemos tiempo hasta el final, como recomendación, para la prox entrega de practica integradora, (si tenes tiempo y ganas) entrega un repo nuevo pero no copies y pegues... 

Anda agregando solo que necesitas.. de esa manera vas a practicar y mejorar muchísimo mas rápido. Vas a tener un codigo mas limpio.
*/