import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messagesCollection = "Messages";

const messagesSchema = new Schema({
  user: {
    type: String,
    unique: true,
  },
  message: String,
});

const messagesModel = model(messagesCollection, messagesSchema);

export default messagesModel;

// El formato es:  {user:correoDelUsuario, message: mensaje del usuario}
