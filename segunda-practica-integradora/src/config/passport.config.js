import passport from "passport";
import jwt from "passport-jwt";
import { roles } from "../constants/roles.js";
// import userModel from "../dao/models/user.model.js";
import { SECRET_JWT, cookieExtractor } from "../utils/jwt.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Desarrollar una estrategia “current” para extraer la cookie que contiene el token para obtener el usuario asociado a dicho token, en caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, utilizar un extractor de cookie:

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_JWT,
      },
      async (jwt_payload, done) => {
        console.log(jwt_payload);
        try {
          // if (roles.includes(jwt_payload.role)) {
          //   return done(null, jwt_payload);
          // }
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default initializePassport;
