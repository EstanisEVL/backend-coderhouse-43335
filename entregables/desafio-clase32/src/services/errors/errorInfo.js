export const generateProductErrorInfo = (product) => {
  return `One or more product properties were missing or weren't valid. List of required properties:
  * title: needs to be a String, received ${product.title}
  * description: needs to be a String, received ${product.description}
  * code: needs to be a Number, received ${product.code}
  * price: needs to be a Number, received ${product.price}
  * status: needs to be a String, received ${product.status}
  * stock: needs to be a Number, received ${product.stock}
  * category: needs to be a String, received ${product.category}
  `;
};

export const generateProductPriceErrorInfo = (price) => {
  return `* price: needs to be a valid value, received ${price}`;
};
