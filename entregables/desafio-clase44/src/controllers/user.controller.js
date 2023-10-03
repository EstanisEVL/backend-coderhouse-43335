import { UserService } from "../repositories/index.js";

export const togglePremium = async (req, res) => {
  try {
    const { uid } = req.params;

    const findUser = await UserService.findUser(null, uid);

    if (!findUser) {
      return res.status(400).json({ message: "Error: User not found." });
    } else {
      if (findUser.role === "admin") {
        return res
          .status(400)
          .json({ message: "Admin cannot change its role to premium." });
      } else {
        if (findUser.role && findUser.role === "premium") {
          findUser.role = "user";

          await findUser.save();

          return res
            .status(200)
            .json({ message: `Role changed to ${findUser.role}` });
        } else {
          const requiredDocs = [
            "identificacion",
            "comprobantededomicilio",
            "comprobantedeestadodecuenta",
          ];

          const docs = findUser.documents.map((doc) =>
            doc.docType.replace(/\s/g, "").toLowerCase()
          );

          const missingDocs = requiredDocs.filter(
            (reqDoc) => !docs.includes(reqDoc)
          );

          if (missingDocs.length > 0) {
            return res.status(400).json({
              message:
                "Error - User cannot be premium until it finishes uploading every required documentation.",
            });
          }

          findUser.role = "premium";

          await findUser.save();

          return res
            .status(200)
            .json({ message: `Role changed to ${findUser.role}` });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "There was an error toggling user role from/to premium.",
    });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserService.findUser(null, uid);

    if (!user) {
      return res.status(400).json({ message: "Error - User not found." });
    } else {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Error - No files found." });
      } else {
        for (const doc of req.files) {
          const { originalname, filename } = doc;
          const { subtype } = req.body;
          const docType = subtype;

          user.documents.push({
            name: originalname.replace(/\s/g, "").toLowerCase(),
            reference: filename.replace(/\s/g, "").toLowerCase(),
            docType: docType.replace(/\s/g, "").toLowerCase(),
          });
        }
        await user.save();

        return res
          .status(200)
          .json({ message: "Documents successfully uploaded." });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "There was an error uploading a document.",
    });
  }
};
