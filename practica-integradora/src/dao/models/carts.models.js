import mongoose from "mongoose";

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  products: {
    type: Array,
    default: [],
  },
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
