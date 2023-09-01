import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import cors from "cors";
import { setLogger } from "./utils/logger.js";
import { NODE_ENV, PORT } from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";

// Importación de rutas:
import viewsRoutes from "./routes/view.routes.js";
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

// Creación de las rutas:
app.use("/", viewsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);

// Levantando el servidor:
app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on PORT: ${PORT_APP}, environment: ${NODE_ENV}`);
});

/*
- Hay detalles que todavía no funcionan: (Son muy de lógica de negocios) lo mas importantes son los de arriba..

    login github
    /profile o /current

Todavía  tenemos tiempo hasta el final, como recomendación, para la prox entrega de practica integradora, (si tenes tiempo y ganas) entrega un repo nuevo pero no copies y pegues... 

Anda agregando solo que necesitas.. de esa manera vas a practicar y mejorar muchísimo mas rápido. Vas a tener un codigo mas limpio.

----------------------------------------------------------------

- AGREGAR VALIDACIONES CON JOI
Longitud de campos de texto:
Puedes agregar validaciones para asegurarte de que los campos de texto, como el nombre y la descripción del producto, no excedan cierta longitud máxima.

Formato de código:
Si el código del producto debe seguir cierto formato específico, puedes agregar una validación para verificar que cumple con ese formato.

Precio no negativo:
Asegúrate de que el precio del producto no sea un valor negativo. Puedes utilizar Joi.number().positive() para esto.

Stock mínimo:
Puedes establecer un valor mínimo aceptable para el stock del producto para asegurarte de que no haya productos con stock negativo.

Categorías válidas:
Si tus productos deben pertenecer a categorías específicas, puedes agregar una validación para asegurarte de que la categoría proporcionada es una categoría válida.

Estado válido:
Si el estado del producto solo puede ser "activo" o "inactivo", asegúrate de que solo se permitan esos valores.

Formato de URL de imagen (si aplica):
Si tienes campos para URL de imágenes de productos, puedes agregar validaciones para asegurarte de que las URLs ingresadas tengan un formato válido.

Formato de fechas (si aplica):
Si tienes campos de fechas en tus productos, puedes validar que las fechas ingresadas tengan un formato válido.

Validación de campos opcionales:
Si tienes campos opcionales en tu esquema de producto, puedes agregar validaciones para asegurarte de que cumplen con ciertas reglas si están presentes.

Validación personalizada:
Puedes agregar validaciones personalizadas utilizando Joi.custom() para aplicar lógica específica de validación según tus necesidades.

----------------------------------------------------------------

- CORREGIR RUTAS DE GITHUB Y SUS MÉTODOS

- MEJORAR ESTILOS DE VISTA DE ADMIN

- IMPLEMENTAR DAO EN FILE SYSTEM:
Completar métodos de File System.

- AGREGAR VISTA PARA RECOVER EN HANDLEBARS

- AGREGAR PAGINACIÓN DE MONGOOSE AL MÉTODO GETPRODUCTS DEL PRODUCT.CONTROLLER.JS

- CORREGIR GITGUARDIAN: Si puede ser que los detecte en los .env ya que el repo es publico..

Si los agregas al gitignore ya no se suben pero sigue estando..

Lo que tenes que hacer es que git deje de rastrear al archivo.. hay un comando que permite hacer eso.. git lo elimina del rastreo y despues lo agregas al gitignore

Otra es un repo nuevo.. lo empezas bien desde 0 y al que ya tenes lo pones privado para no eliminarlo

cuando estan privado git guardian no molesta

----------------------------------------------------------------

Desafío clase 37:
Consigna:
Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos.

Aspectos a incluir:
- Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla):
  El link del correo debe expirar después de 1 hora de enviado;
  Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña;
  Si el link expiró, debe redirigir a una vista que le permita generar nuevamente el correo de restablecimiento, el cual contará con una nueva duración de 1 hora.

- Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos.

- Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto:
  Si un producto se crea sin owner, se debe colocar por defecto “admin”;
  El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios premium).

- Modificar los permisos de modificación y eliminación de productos para que:
  Un usuario premium sólo pueda borrar los productos que le pertenecen;
  El admin pueda borrar cualquier producto, aún si es de un owner.

- Además, modificar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece.

- Implementar una nueva ruta en el router de api/users, la cual será /api/users/premium/:uid  la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.

Te recomendamos testear muy bien todas las políticas de acceso. ¡Son la parte fuerte de este entregable!
*/
