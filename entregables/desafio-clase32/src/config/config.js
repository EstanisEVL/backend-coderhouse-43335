import { config } from "dotenv";

config({
  path: `./.env.${process.env.NODE_ENV || "development"}.local`,
});

export const { NODE_ENV, PORT, PERSISTENCE, MONGO_URL } = process.env;
