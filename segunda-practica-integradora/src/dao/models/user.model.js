import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Usuarios";

const roleType = {
  admin: "admin",
  user: "user",
  public: "public",
};

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  carts: {
    // Id con referencia a Carts:
    type: [
      {
        cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carritos" },
      },
    ],
    default: [],
  },
  role: { type: String, enum: Object.values(roleType), default: roleType.user },
});

schema.plugin(mongoosePaginate);

schema.pre("find", function () {
  this.populate("carts.cart");
});

const userModel = mongoose.model(collection, schema);
export default userModel;
