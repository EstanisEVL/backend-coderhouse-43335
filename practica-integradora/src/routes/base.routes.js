import { Router } from "express";

class BaseRoute {
  path = "/alive";
  router = Router();

  constructor() {
    this.initBaseRoutes();
  }

  initBaseRoutes() {
    this.router.get(`${this.path}`, (req, res) => {
      res.status(200).json({ ok: true, message: `I AM AN API AND I'M ALIVE` });
    });
  }
}

export default BaseRoute;
