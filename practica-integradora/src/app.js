import express from "express";
import cors from "cors";
import displayRoutes from "express-routemap";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import processEnv from "./config/config.js";
import mongoDbConnection from "./db/mongo.config.js";

class App {
  app;
  env;
  port;
  server;

  constructor(routes) {
    this.app = express();
    this.env = processEnv.NODE_ENV || "development";
    this.port = processEnv.PORT || 8000;
    this.course = processEnv.CURSO;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.connectDb();
    this.initHandlebars();
  }

  getServer() {
    return this.app;
  }

  closeServer(done) {
    this.server = this.app.listen(this.port, () => {
      done();
    });
  }

  async connectDb() {
    await mongoDbConnection();
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/static", express.static(`${__dirname}/public`));
  }

  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use(`/api/${processEnv.API_VERSION}`, route.router);
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      displayRoutes(this.app);
      console.log(`================================`);
      console.log(`======= COURSE: ${this.course} =======`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on port: ${this.port}`);
      console.log(`================================`);
    });
  }

  initHandlebars() {
    this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", `${__dirname}/views`);
    this.app.set("views engine", "handlebars");
  }
}

export default App;
