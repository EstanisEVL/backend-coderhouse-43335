export default class ProductDTO {
  constructor(product, cid = null) {
    const {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    } = product;
    this.cid = cid;
    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
  }
}

/*
AGREGAR VALIDACIONES CON JOI
Longitud de campos de texto:
Puedes agregar validaciones para asegurarte de que los campos de texto, como el nombre y la descripción del producto, no excedan cierta longitud máxima.

Formato de código:
Si el código del producto debe seguir cierto formato específico, puedes agregar una validación para verificar que cumple con ese formato.

Precio no negativo:
Asegúrate de que el precio del producto no sea un valor negativo. Puedes utilizar Joi.number().positive() para esto.

Stock mínimo:
Puedes establecer un valor mínimo aceptable para el stock del producto para asegurarte de que no haya productos con stock negativo.

Categorías válidas:
Si tus productos deben pertenecer a categorías específicas, puedes agregar una validación para asegurarte de que la categoría proporcionada es una categoría válida.

Estado válido:
Si el estado del producto solo puede ser "activo" o "inactivo", asegúrate de que solo se permitan esos valores.

Formato de URL de imagen (si aplica):
Si tienes campos para URL de imágenes de productos, puedes agregar validaciones para asegurarte de que las URLs ingresadas tengan un formato válido.

Formato de fechas (si aplica):
Si tienes campos de fechas en tus productos, puedes validar que las fechas ingresadas tengan un formato válido.

Validación de campos opcionales:
Si tienes campos opcionales en tu esquema de producto, puedes agregar validaciones para asegurarte de que cumplen con ciertas reglas si están presentes.

Validación personalizada:
Puedes agregar validaciones personalizadas utilizando Joi.custom() para aplicar lógica específica de validación según tus necesidades.
*/