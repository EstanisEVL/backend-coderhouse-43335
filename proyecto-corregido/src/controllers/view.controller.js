export const home = async (req, res) => {
  try {
    res.redirect("/login");
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 5 - ${err}`);
    throw err;
  }
};

export const login = async (req, res) => {
  try {
    res.render("login", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 14 - ${err}`);
  }
};

export const register = async (req, res) => {
  try {
    res.render("register", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 22 - ${err}`);
  }
};

export const recover = async (req, res) => {
  try {
    res.render("recover", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 30 - ${err}`);
  }
};

export const reset = async (req, res) => {
  try {
    res.render("reset", { style: "styles.css" });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 38 - ${err}`);
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.session.user;
    res.status(200).render("profile", { style: "styles.css", user });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 47 - ${err}`);
  }
};

export const admin = async (req, res) => {
  try {
    const user = req - session.user;
    res.status(200).render("admin", { style: "styles.css", user });
  } catch (err) {
    req.logger.error(`Error in view.controller.js - line 56 - ${err}`);
  }
};