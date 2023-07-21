import jwt from "jsonwebtoken";
import passport from "passport";

export const SECRET_JWT = "CLAVEs3p3rs3cr3t4S1s1";

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

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["Cookie"];
  }
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          // ver si sirve String(info) sino cambiarla por info.toString()
          error: info.messages ? info.messages : String(info),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
