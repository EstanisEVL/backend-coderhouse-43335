import App from "./app.js";
import BaseRoute from "./routes/base.routes.js";
import ProductRoutes from "./routes/products.routes.js";
import CartRoutes from "./routes/carts.routes.js";
import ViewsRoutes from "./routes/views.routes.js"

const app = new App([
  new BaseRoute(),
  new ProductRoutes(),
  new CartRoutes(),
  new ViewsRoutes(),
])

app.listen();