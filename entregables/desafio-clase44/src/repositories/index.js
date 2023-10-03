import { Carts, Products, Users } from "../dao/factory.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./product.repository.js";
import UserRepository from "./user.repository.js";

export const CartService = new CartRepository(new Carts());
export const ProductService = new ProductRepository(new Products());
export const UserService = new UserRepository(new Users());
