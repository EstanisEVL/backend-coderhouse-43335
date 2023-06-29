import { Router } from "express";
import ProductManager from "../dao/managers/products.manager.js";

const router = Router();

const manager = new ProductManager();

/* 
Métodos crud para los productos:
Con base en nuestra implementación actual de productos, modificar el método GET / para que cumpla con los siguientes puntos:
Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional):
- limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
- page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1
- query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar, por ejemplo "categorías" o "disponibilidad"), en caso de no recibir query, realizar la búsqueda general
- sort: asc(1)/desc(+1), para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento

Los valores "opcionales" ya deben traer un valor por defecto.

El método GET deberá devolver un objeto con el siguiente formato:
{
	status:success/error
  payload: Resultado de los productos solicitados
  totalPages: Total de páginas
  prevPage: Página anterior
  nextPage: Página siguiente
  page: Página actual
  hasPrevPage: Indicador para saber si la página previa existe
  hasNextPage: Indicador para saber si la página siguiente existe.
  prevLink: Link directo a la página previa (null si hasPrevPage=false)
  nextLink: Link directo a la página siguiente (null si hasNextPage=false)
}

Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.
*/
router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    return res.status(200).json({
      status: "success",
      payload: { products },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      payload: err,
    });
  }
});

// Agregar paginación al get anterior

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productById = await manager.getProductById(pid);

    if (!productById) {
      return res.status(400).json({
        status: "error",
        payload: "Error: Id inexistente",
      });
    }

    return res.status(200).json({
      status: "success",
      payload: productById,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    if (
      product.title &&
      product.description &&
      product.code &&
      product.price &&
      product.status &&
      product.stock &&
      product.category
    ) {
      const productAdded = await manager.addProduct(product);

      return res.status(200).json({
        status: "success",
        payload: productAdded,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Ingrese todos los campos requeridos" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleteProduct = await manager.deleteProduct(pid);
    return res.status(200).json({
      status: "success",
      payload: deleteProduct,
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
