import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import displayRoutes from "express-routemap";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
// import processEnv from "./config/config.js";
// import mongoDbConnection from "./db/mongo.config.js";

// Rutas:
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import ViewsRoutes from "./routes/views.routes.js";

const app = express();
const PORT = 8080;

const MONGO_URL = "mongodb+srv://estanislaovl:AGqTG7UAgI5ZaU3W@ecommerce.jmbjtvw.mongodb.net/?retryWrites=true&w=majority"

console.log("🚀 ~ file: app.js:23 ~ MONGO_URL:", MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));

const connection = mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("🚀 ~ file: app.js:27 ~ CONECTADO!:");
  })
  .catch((err) => {
    console.log("🚀 ~ file: app.js:29 ~ ERROR:", err);
  });

app.use("/api/products/", productsRoutes);
app.use("/api/carts/", cartsRoutes);

app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`================================`);
  console.log(`🚀 App listening on port: ${PORT}`);
  console.log(`================================`);
});








// class App {
// app;
// env;
// port;
// server;

// constructor(routes) {
//   this.app = express();
//   this.env = processEnv.NODE_ENV || "development";
//   this.port = processEnv.PORT || 8000;
//   this.course = processEnv.CURSO;

//   this.initializeMiddlewares();
//   this.initializeRoutes(routes);
//   this.connectDb();
//   this.initHandlebars();
// }

// getServer() {
//   return this.app;
// }

// closeServer(done) {
//   this.server = this.app.listen(this.port, () => {
//     done();
//   });
// }

// async connectDb() {
//   await mongoDbConnection();
// }

// initializeMiddlewares() {
//   this.app.use(cors());
//   this.app.use(express.json());
//   this.app.use(express.urlencoded({ extended: true }));
//   this.app.use("/static", express.static(`${__dirname}/public`));
// }

// initializeRoutes(routes) {
//   routes.forEach((route) => {
//     this.app.use(`/api/${processEnv.API_VERSION}`, route.router);
//   });
// }

// listen() {
//   this.app.listen(this.port, () => {
//     displayRoutes(this.app);
//     console.log(`================================`);
//     console.log(`======= COURSE: ${this.course} =======`);
//     console.log(`======= ENV: ${this.env} =======`);
//     console.log(`🚀 App listening on port: ${this.port}`);
//     console.log(`================================`);
//   });
// }

// initHandlebars() {
//   this.app.engine("handlebars", handlebars.engine());
//   this.app.set("views", `${__dirname}/views`);
//   this.app.set("views engine", "handlebars");
// }
// }

// export default App;
