import mongoose from "mongoose";

const collectionName = "Usuarios";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  rol: {
    type: String,
    default: "usuario"
  },
})

const userModel = mongoose.model(collectionName, userSchema);
export default userModel;