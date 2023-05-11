/*---- Servidores con express: ----*/
import express from "express";
import ProductManager from "./managers/ProductManager.js";

const manager = new ProductManager();
const app = express();

app.use(express.urlencoded({ extended: true }));

// ✓	Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos:
// ✓	Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos:
app.get("/products", async (req, res) => {
  const products = await manager.getProducts();
  const limit = parseInt(req.query.limit);
  const filteredProducts = products.slice(0, limit);
  if (limit) res.send(filteredProducts);
  else res.send(products);
});

// ✓	Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2:
// ✓	Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe:
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const products = await manager.getProducts();
  const product = products.find((product) => product.id == id);
  if (product) return res.send(product);
  res.status(404).json({ error: "El producto no existe" });
});

// Se levanta el servidor:
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
