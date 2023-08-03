class ViewsController {
  home = async (req, res) => {
    try {
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  };

  login = async (req, res) => {
    try {
      res.render("login", { style: "styles.css" });
    } catch (err) {
      console.log(err);
    }
  };

  register = async (req, res) => {
    try {
      res.render("register", { style: "styles.css" });
    } catch (err) {
      console.log(err);
    }
  };

  // AGREGAR VISTA PARA RECOVER EN HANDLEBARS
  recover = async (req, res) => {
    try {
      res.render("recover", { style: "styles.css" });
    } catch (err) {
      console.log(err);
    }
  };

  profile = async (req, res) => {
    try {
      const user = req.session.user;
      res.status(200).render("profile", {
        style: "styles.css",
        user,
      });
    } catch (err) {
      console.log(err);
    }
  };

  admin = async (req, res) => {
    try {
      const user = req.session.user;
      res.status(200).render("admin", {
        style: "styles.css",
        user,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export default ViewsController;
