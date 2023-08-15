import { PERSISTENCE } from "../config/config.js";
import Connection from "../utils/connect.js";

export let Carts;
export let Products;
export let Sessions;
export let Tickets;

switch (PERSISTENCE) {
  case "MONGO":
    const mongoInstance = Connection.getInstance();
    const { default: CartServiceDao } = await import(
      "../dao/mongodb/cart.mongo.js"
    );
    const { default: ProductServiceDao } = await import(
      "../dao/mongodb/product.mongo.js"
    );
    const { default: SessionServiceDao } = await import(
      "./mongodb/user.mongo.js"
    );
    const { default: TicketServiceDao } = await import(
      "./mongodb/ticket.mongo.js"
    );
    Carts = CartServiceDao;
    Products = ProductServiceDao;
    Sessions = SessionServiceDao;
    Tickets = TicketServiceDao;
    break;

  // IMPLEMENTAR DAO EN FILE SYSTEM:
  case "FS":
    const { default: CartServiceFs } = await import(
      "./memory/cart.fs.js"
    );
    const { default: ProductServiceFs } = await import(
      "./memory/product.fs.js"
    );
    const { default: SessionServiceFs } = await import(
      "./memory/user.fs.js"
    );
    const { default: TicketServiceFs } = await import(
      "./memory/user.fs.js"
    );
    Carts = CartServiceFs;
    Products = ProductServiceFs;
    Sessions = SessionServiceFs;
    Tickets = TicketServiceFs;
    break;
}
