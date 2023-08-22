import { PERSISTENCE } from "../config/config.js";
import Connection from "../utils/connect.js";

export let Products;

switch (PERSISTENCE) {
  case "MONGO":
    const mongoInstance = Connection.getInstance();
    const { default: ProductServiceDao } = await import(
      "../dao/mongodb/product.mongo.js"
    );
    Products = ProductServiceDao;
    break;
}