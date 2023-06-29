import { Router } from "express";
import productsModel from "../dao/models/products.model.js";

const router = Router();

/*
Crear una vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:
Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.
Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.
*/

router.get("/products", async (req, res) => {
  const { page = 1, limit= 10 } = req.query;

  const { docs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } =
    await productsModel.paginate({}, { limit, page, lean: true });

  res.status(200).render("products", {
    products: docs,
    page,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink
  })
})

/*
Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito.
*/
router.get("/carts/:cid", async (req, res) => {

})

export default router;