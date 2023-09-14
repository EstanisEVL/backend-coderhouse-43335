import {
  CartService,
  ProductService,
  TicketService,
} from "../repositories/index.js";
import CartDTO from "../dtos/cart.dto.js";
import TicketDTO from "../dtos/ticket.dto.js";
import { sendMail } from "../helpers/email.helper.js";
import validationUtils from "../utils/validate.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await CartService.getCarts();
    return res.status(200).json({ message: "Carts: ", carts });
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 13 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting all carts." });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      return res.status(200).json({ message: "Carts: ", cart });
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 30 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error getting a cart by id." });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = new CartDTO();
    const cart = await CartService.createCart(newCart);
    return res.status(200).json({ message: "Created cart: ", cart });
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 39 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error creating a cart." });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await ProductService.getProduct(null, pid);
    if (!product) {
      return res.status(404).json({ message: "Error: Product not found." });
    } else {
      const cart = await CartService.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ message: "Error: Cart not found." });
      } else {
        const pInCart = cart.products.find(
          (product) => String(product.product._id) === String(pid)
        );
        if (pInCart) {
          pInCart.quantity++;
          await cart.save();
          return res.status(200).json({ message: "Product quantity updated." });
        } else {
          const updatedCart = await CartService.addProductToCart(cid, pid);
          return res
            .status(200)
            .json({ message: "Product added to cart: ", updatedCart });
        }
      }
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 78 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error adding a product to your cart." });
  }
};

// SEGUIR ACÁ CONECTANDO MÉTODOS Y PASAR A LOS DEMÁS CONTROLADORES, LUEGO SEGUIR CON CORRECCIONES DE APP.JS
// AL FINAL REVISAR LÍNEAS DE ERRORES EN LOGGER
// ACÁ REVISAR CÓMO Y PARA QUÉ SE USARÍA ESTA FUNCIÓN
export const updateCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedBody = req.body;

    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      if (!validationUtils.validateUpdatedCartBody(updatedBody)) {
        return res
          .status(400)
          .json({ message: "The updated cart body must contain products." });
      }
      const updatedCart = await CartService.updateCartById(cid, updatedBody);

      return res.status(200).json({ message: "Updated cart: ", updatedCart });
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 107 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error updating a cart." });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const uProductBody = req.body;
    if (!validationUtils.validateProductBody(uProductBody)) {
      return res.status(400).json({
        message:
          "Only the following product fields can be modified: title, description, code, price, status, stock and category.",
      });
    }
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      // Buscar producto a actualizar en el carrito
      const product = cart.products.findIndex(
        (prod) => String(prod.product._id) === String(pid)
      );
      if (product === -1) {
        return res
          .status(404)
          .json({ message: "Error: Product does not exist in cart." });
      } else {
        // Actualizar el producto encontrado en el carrito de acuerdo al comentario debajo:
      }
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 142 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error updating a product in cart." });
  }
};
/*
Esta funcionalidad es para modificar la cantidad de productos que tenes en el carrito. no para cambiar el precio, nombre o lo que sea.

Lo que podes hacer es usar ese endpoint y agregar o sacar productos..

Por params envias el cid y pid. En el body envias lo que necesitas hacer..

{ quantity : 2, operation : “add” } // yo lo haria asi.. hay muchas formas de hacer lo mismo..

Para quitar.. { quantity : 2, operation : “remove” }

En el controller comparas el operation y le aplicas la lógica que necesites..

Puede ser que no se guarde en la base de datos porque la query que estas poniendo no encuentra un documento con lo que le pedis..

await Model.updateOne({ userID }, { $set: { ‘events.$[event].enabled’: true } }, { arrayFilters: [{ ‘event._id’: eventID }]);

Algo asi tenes que usar para hacer una actualizacion de un objeto dentro de un array
*/

// REVISAR LINEA LOGGER:
export const purchaseProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.body;
    
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      if (cart.products.length === 0) {
        return res.status(404).json({ message: "Cart is empty." });
      } else {
        const productsToPurchase = cart.products;
        const productToUpdate = [];
        let fullPrice = 0;
        
        for (const product of productsToPurchase) {
          const pid = String(product.product._id);
          const productQuantity = Number(product.quantity);
          
          const productInStock = await ProductService.getProduct(null, pid);
          if (!productInStock) {
            return res
              .status(404)
              .json({ message: "Product is not in stock." });
          } else {
            if (productQuantity > productInStock.stock) {
              return res.status(400).json({
                message: `Not enough stock of ${productInStock.title}`,
              });
            } else {
              fullPrice += productQuantity * productInStock.price;

              productToUpdate.push({
                pid: pid,
                quantity: productQuantity,
              });
            }
          }
        }

        const ticketData = new TicketDTO({
          purchase_datetime: new Date(),
          amount: fullPrice,
          purchaser: userEmail.email,
        });

        
        const newTicket = await TicketService.createTicket(ticketData);
        
        for (const product of productToUpdate) {
          const pid = product.pid;
          const productQuantity = Number(product.quantity);

          const productInStock = await ProductService.getProduct(null, pid);
          const newStock = Number(productInStock.stock) - productQuantity;

          await ProductService.updateProduct(pid, { stock: newStock });
        }

        sendMail(newTicket.purchaser, newTicket.amount, newTicket.purchase_datetime);

        cart.products = [];
        await cart.save();

        return res
          .status(200)
          .json({ message: "Purchase successfully completed.", newTicket });
      }
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 240 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error purchasing products." });
  }
};

export const deleteCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      const deletedCart = await CartService.deleteCartById(cid);
      return res
        .status(200)
        .json({ message: "Cart successfully deleted.", deletedCart });
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 261 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error deleting the cart." });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      const productIndex = cart.products.findIndex(
        (prod) => String(prod.product._id) === String(pid)
      );
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Error: Product does not exist in cart." });
      } else {
        const productInCart = cart.products.find(
          (prod) => String(prod.product._id) === String(pid)
        );
        if (productInCart && productInCart.quantity > 1) {
          productInCart.quantity--;
          await cart.save();
          return res.status(200).json({ message: "Product quantity updated." });
        } else {
          cart.products.splice(productIndex, 1);
          const updatedCart = await cart.save();
          return res
            .status(200)
            .json({ message: "Product deleted from cart. ", updatedCart });
        }
      }
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 302 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error deleting a product from cart." });
  }
};
