import { connect, mongo } from "mongoose";
import processEnv from "../config/config.js";

const configConnection = {
  url:
    processEnv.DB_CNN ??
    `mongodb:// ${processEnv.DB_HOST}:${processEnv.DB_PORT}/${processEnv.DB_NAME}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoDbConnection = async () => {
  try {
    await connect(configConnection.url, configConnection.options);
    console.log(`===================== CONEXIÓN MONGO`);
    console.log(
      `========== URL: ${configConnection.url.substring(0, 20)} ==========`
    );
    console.log(`=====================`);
  } catch (err) {
    console.log(
      `🚀 ~ file: mongo.config.js: 8 ~ mongoDbConnection ~ err: ${err}`
    );
  }
};

export default mongoDbConnection;
