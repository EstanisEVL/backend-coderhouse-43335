import { Router } from "express";

class CartRoutes {
  path = "/carts";
  router = Router();

  constructor() {
    this.initCartRoutes();
  }

  initCartRoutes() {
    this.router.get(`${this.path}`, async (req, res) => {
      return res.json({
        message: "cart GET ALL",
      });
    });
    this.router.get(`${this.path}/:cid`, async (req, res) => {
      return res.json({
        message: "cart GET BY ID",
      });
    });
    this.router.post(`${this.path}/`, async (req, res) => {
      return res.json({
        message: "cart POST",
      });
    });
    this.router.put(`${this.path}/:cid`, async (req, res) => {
      return res.json({
        message: "cart PUT",
      });
    });

    this.router.delete(`${this.path}/:cid`, async (req, res) => {
      return res.json({
        message: "cart DELETE",
      });
    });
  }
}

export default CartRoutes;
