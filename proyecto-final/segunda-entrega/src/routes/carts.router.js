/* 
Métodos crud para el carrito:
Además, agregar al router de carts los siguientes endpoints:

DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.

PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.

PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

DELETE api/carts/:cid deberá eliminar todos los productos del carrito 

Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.
*/