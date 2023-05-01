import ProductManager from "./managers/ProductManager.js";

const get = async () => {
  let result = await manager.getProducts();
  console.log(result);
} 
const send = async () => {
  let product = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
  };
  let result = await manager.addProduct(product);
  return result;
};
const getById = async (id) => {
  let result = await manager.getProductById(id);
  return result;
}
const update = async (id, field) => {
  let result = await manager.updateProduct(id, field);
  return result;
}
const del = async (id) => {
  let result = await manager.deleteProduct(id);
  return result;
}

/*---- TESTING: ---- */
// ✓	Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager();

// ✓	Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []:
get();

/* ✓	Se llamará al método “addProduct” con los campos:
-	title: “producto prueba”
-	description:”Este es un producto prueba”
-	price:200,
-	thumbnail:”Sin imagen”
-	code:”abc123”,
-	stock:25
*/
// ✓	El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE:
send();

// ✓	Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado:
get();

// ✓	Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error:
getById(1);

// ✓	Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización:
update(1, {title: "producto prueba actualizado"});

// ✓	Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
del(1);

