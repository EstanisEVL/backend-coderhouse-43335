import { config } from "dotenv";

config({
  path: `./.env.${process.env.NODE_ENV || "development"}.local`,
});

console.log("config LOADED ENVIRONMENT:", `env.${process.env.NODE_ENV}.local`);

const { PORT, MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SECRET_JWT } = process.env;

export { PORT, MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SECRET_JWT };
