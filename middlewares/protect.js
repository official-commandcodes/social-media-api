const DataSecurity = require("../helpers/security/data.security");
const Status = require("../helpers/status-code");
const { UserModel } = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const authorizationToken = req.headers.authorization;

    if (authorizationToken) {
      const token = authorizationToken.split(" ").at(-1);

      if (token) {
        const decoded = await DataSecurity.verifyJWTToken(token);

        // Find the user
        const user = await UserModel.findOne({ manualId: decoded.id }).select("+password +isVerified +otp");

        if (!user) {
          return res.status(204).json({
            status: "success",
            message: "user account does not exist!",
          });
        }

        // store user info
        req.user = user;
        req.userId = user.manualId;
        return next();
      } else {
        return res.status(Status.BAD_REQUEST).json({
          message: "Token not in provided header request.",
        });
      }
    } else {
      return res.status(Status.BAD_REQUEST).json({
        message: "Provide Authorization header",
      });
    }
  } catch (error) {
    return res.status(Status.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

module.exports = protect;
