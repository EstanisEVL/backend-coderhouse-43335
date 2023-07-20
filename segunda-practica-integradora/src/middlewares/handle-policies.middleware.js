import passport from "passport";

// Códigos de errores: 400 - bad request; 401 - not authorized (autenticación requerida); 403 - forbidden (el usuario no tiene los permisos necesarios); 404 - not found;

function handlePolicies(policies) {
  return (req, res, next) => {
    if (policies.length === 1 && policies[0] === "public") {
      return next();
    }

    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      console.log(userJWT);

      if (err) {
        return next(err);
      }

      if (!userJWT) {
        return res
          .status(401)
          .send({ message: "Acceso denegado: token inválido o expirado." });
      }

      if (policies.includes(userJWT.user.role)) {
        req.user = userJWT;
        return next();
      } else {
        return res.status(403).send({
          message: "Acceso denegado: usuario sin permisos necesarios.",
        });
      }
    })(req, res, next);
  };
}

export default handlePolicies;
