import { SessionService } from "../repositories/index.js";

export const togglePremium = async (req, res) => {
  try {
    const { uid } = req.params;

    const fUser = await SessionService.findUser(uid);

    if (!fUser) {
      return res.status(400).json({ message: "Error: User not found." });
    } else {
      if (fUser.role === "admin") {
        return res
          .status(400)
          .json({ message: "Admin cannot change its role to premium." });
      } else {
        fUser.role && fUser.role === "user"
          ? (fUser.role = "premium")
          : (fUser.role = "user");
        await fUser.save();
        return res
          .status(200)
          .json({ message: `Role changed to ${fUser.role}` });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "There was an error toggling user role from/to premium.",
    });
  }
};
