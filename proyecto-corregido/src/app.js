import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import cors from "cors";
import handlebars from "express-handlebars";
import { NODE_ENV, PORT } from "./config/config.js";
import __dirname from "./utils.js";
import { setLogger } from "./utils/logger.js";
import initializePassport from "./config/passport.config.js";

// Importación de rutas:
import viewRoutes from "./routes/view.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import sessionRoutes from "./routes/session.routes.js";

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
app.use(setLogger);

// Handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Passport:
initializePassport();
app.use(passport.initialize());

// Creación de rutas:
app.use("/", viewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);

// Levantando el servidor:
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on PORT: ${PORT_APP} || Environment: ${NODE_ENV}.`);
});


/*
-----------------------------------------------------------------
- Hay detalles que todavía no funcionan: (Son muy de lógica de negocios) lo mas importantes son los de arriba..

  /profile o /current

tira errores de tu sessionService

yo probe directamente con UserModel y funciona

y el de api/sessions/current el que puede guardar datos es el navegador.. por postman no
es tan asi.. todo lo que tenga que ver con session probalo con el navegador..

postman para llamadas a endpoint.. no para navegar como si tenes una session en curso

Todavía  tenemos tiempo hasta el final, como recomendación, para la prox entrega de
practica integradora, (si tenes tiempo y ganas) entrega un repo nuevo pero no copies y
pegues... 

Anda agregando solo que necesitas.. de esa manera vas a practicar y mejorar muchísimo mas
rápido. Vas a tener un codigo mas limpio.

---------------------------------------------------------------

// SEGUIR EN policies.middleware.js línea 20 Y CORREGIR ERROR DEL ACCESS TOKEN:

---------------------------------------------------------------

- CORREGIR ERROR DE ACCESS TOKEN DE GITHUB CUANDO EL USUARIO INTENTA AGREGAR O QUITAR PRODUCTOS DEL CARRITO

- AGREGAR FUNCIONALIDADES A BOTONES DE PANEL ADMIN

- IMPLEMENTAR DAO EN FILE SYSTEM:
Completar métodos de File System.

- AGREGAR PAGINACIÓN DE MONGOOSE AL MÉTODO GETPRODUCTS DEL PRODUCT.CONTROLLER.JS

- VERIFICAR URL DE PRODUCCIÓN EN LA VARIABLE DE ENTORNO LUEGO DEL PRIMER DESPLIEGUE

- CORREGIR GITGUARDIAN: Si puede ser que los detecte en los .env ya que el repo es publico..

Si los agregas al gitignore ya no se suben pero sigue estando..

Lo que tenes que hacer es que git deje de rastrear al archivo.. hay un comando que permite
hacer eso.. git lo elimina del rastreo y despues lo agregas al gitignore

Otra es un repo nuevo.. lo empezas bien desde 0 y al que ya tenes lo pones privado para no
eliminarlo

cuando estan privado git guardian no molesta

- RESPONSIVE: PROFILE

-----------------------------------------------------------------

Algunas cosas no puedo probarlas desde el front porque no están implementadas. O están fallando.

Lo ideal para la próxima practica integradora es lo siguiente. (va a ser la ultima antes de la entrega final)

En próximas clase van a aprender a usar swagger (Documentar API) Lo recomendado es que todo lo que haga tu ecommerce este ahí. 

Desde la creación de un usuario hasta el botón de purchase. 

De esa forma vamos a probar su ecommerce si es que falla el front.. 

Lo mas importante del front es que uno pueda registrarse y hacer todo el proceso de compra. 

Despues lo de agregar productos si sos admin o premium, eliminar, modificar o lo que sea... eso no es necesario un front.. pero si que funcionen los endpoints.

Otra recomendación puede ser si usas postman, crear una colección con todos los endpoints y los datos que necesita para funcionar. Eso después lo podes compartir conmigo y con el profe. 

-----------------------------------------------------------------

TESTEAR ENDPOINTS CON MOCHA, CHAI Y SUPERTEST
*/
