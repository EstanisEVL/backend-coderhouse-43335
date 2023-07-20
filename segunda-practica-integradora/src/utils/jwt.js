import jwt from "jsonwebtoken";
import passport from "passport";

export const SECRET_JWT = "CLAVEs3p3rs3cr3t4S1s1";

// Desarrollar una estrategia “current” para extraer la cookie que contiene el token para obtener el usuario asociado a dicho token, en caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, utilizar un extractor de cookie:

export const generateJwt = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SECRET_JWT, { expiresIn: "30m" }, (err, token) => {
      if (err) {
        console.log(err);
        reject("Cannot generate jwt token.");
      }
      resolve(token);
    });
  });
};

export const cookieExtractor = () => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          // ver si sirve String(info) sino cambiarla por info.toString()
          error: info.messages ? info.messages : String(info),
          message: "Jwt error.",
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};
