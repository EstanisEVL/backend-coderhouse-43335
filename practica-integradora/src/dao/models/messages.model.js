import mongoose from "mongoose";

const messagesCollection = "Messages";

const messagesSchema = new mongoose.Schema({
  
})

const messagesModel = mongoose.model(messagesCollection, messagesSchema);

export default messagesModel;

// El formato es:  {user:correoDelUsuario, message: mensaje del usuario}