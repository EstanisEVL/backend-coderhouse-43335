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

// ACÁ REVISAR CÓMO Y PARA QUÉ SE USARÍA ESTA FUNCIÓN:
export const updateCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedBody = req.body;

    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      // Validar cartBody:
      // if (!validationUtils.validateUpdatedCartBody(updatedBody)) {
      //   return res
      //     .status(400)
      //     .json({ message: "The updated cart body must contain products." });
      // }
      console.log(cart);
      // const updatedCart = await CartService.updateCartById(cid, updatedBody);

      return res.status(200).json({ message: "Updated cart: " });
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 111 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error updating a cart." });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedProductBody = req.body;

    if (!validationUtils.validateUpdatedProductBody(updatedProductBody)) {
      return res.status(400).json({
        message: "Error - Invalid product body.",
      });
    }
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      const product = cart.products.find(
        (prod) => String(prod.product._id) === String(pid)
      );
      if (product === -1) {
        return res
          .status(404)
          .json({ message: "Error - Product does not exist in cart." });
      } else {
        if (String(updatedProductBody.operation).toLowerCase() === "add") {
          const updatedQuantity = updatedProductBody.quantity;
          product.quantity += updatedQuantity;
          await cart.save();
          return res
            .status(200)
            .json({ message: "Product quantity succesfully updated." });
        } else if (
          String(updatedProductBody.operation).toLowerCase() === "remove"
        ) {
          const updatedQuantity = updatedProductBody.quantity;
          product.quantity -= updatedQuantity;
          if (product.quantity <= 0) {
            product.quantity = 1;
            await cart.save();
            return res
              .status(200)
              .json({ message: "Product succesfully updated." });
          } else {
            await cart.save();
            return res
              .status(200)
              .json({ message: "Product succesfully updated." });
          }
        } else {
          return res.status(400).json({
            message: "Error - Only add or remove operations are accepted.",
          });
        }
      }
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 173 - ${err}`);
    return res
      .status(500)
      .json({ message: "There was an error updating a product in cart." });
  }
};

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

        sendMail(
          newTicket.purchaser,
          newTicket.amount,
          newTicket.purchase_datetime
        );

        cart.products = [];
        await cart.save();

        return res
          .status(200)
          .json({ message: "Purchase successfully completed.", newTicket });
      }
    }
  } catch (err) {
    req.logger.error(`Error in cart.controller.js - line 254 - ${err}`);
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
