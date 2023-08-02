import userModel from "../dao/models/user.model.js";
import productsModel from "../dao/models/product.model.js";

class SessionService {
  userModel;

  constructor() {
    this.userModel = userModel;
  }

  findUser = async (email) => {
    const user = await userModel.findOne({ email: email });
    return user;
  };

  createUser = async (userInfo) => {
    const newUser = await userModel.create(userInfo);
    return newUser;
  };

  getProducts = async () => {
    const products = await productsModel.paginate({}, {lean:true});
    return products;
  }
}

export default SessionService;
