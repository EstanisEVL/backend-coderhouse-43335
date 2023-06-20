import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

// REVISAR SI ESTÁ BIEN HECHA LA EXPORTACIÓN
const {
  API_VERSION,
  NODE_ENV,
  PORT,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  CURSO,
} = process.env;


const processEnv = {
  API_VERSION,
  NODE_ENV,
  PORT,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  CURSO,
};

export default processEnv;