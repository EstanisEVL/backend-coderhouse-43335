import passport from "passport";
import jwt from "passport-jwt";
import {roles} from "../constants/roles.js";
// import userModel from "../dao/models/user.model.js"; 
import { SECRET_JWT } from "../utils/jwt.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Desarrollar una estrategia “current” para extraer la cookie que contiene el token para obtener el usuario asociado a dicho token, en caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, utilizar un extractor de cookie:

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_JWT,
      },
      async (jwtPayload, done) => {
        console.log(jwtPayload);
        try {
          if (roles.includes(jwtPayload.role)) {
            return done(null, jwtPayload);
          }
          return done(null, jwtPayload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default initializePassport;