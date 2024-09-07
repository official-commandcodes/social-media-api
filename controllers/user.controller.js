const { UserModel } = require("../models/user.model");
const { validationRegisterUser, validationLoginUser } = require("../validation/user.validation");
const Status = require("../helpers/status-code");
const DataSecurity = require("../helpers/security/data.security");
const SendEmail = require("../helpers/send-mail");

const cookieInfo = {
  maxAge: process.env.JWT_EXPIRE, // Cookie expires in 24hours(milliseconds)
  httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
  secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent only over HTTPS in production
  sameSite: "lax", // Controls cross-site request behavior
};

// Register
const registerController = async (req, res) => {
  // Joi Validation
  const { error } = validationRegisterUser(req.body);

  // If there is any error while validating
  if (error) {
    return res.status(Status.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }

  try {
    // Check if user exists in the database
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(Status.BAD_REQUEST).json({
        message: "User already exist",
      });
    }

    // Generate OTP
    const rawOTP = DataSecurity.generateDigit(4);
    const hashedOTP = await DataSecurity.hash(rawOTP);

    // Create new User
    const newUser = await UserModel.create({ ...req.body, otp: hashedOTP });

    // Sending Email
    await new SendEmail(newUser.email).verifyEmail({ name: newUser.username, otp: rawOTP });

    // generate JWT token
    const token = await DataSecurity.generateJWTToken(newUser.manualId); // create token with the manualId(uuid)

    // Get pure & clean user object
    const getNewUser = await UserModel.findOne({ manualId: newUser.manualId }).lean();

    // Response
    res.status(Status.CREATED).cookie("commandcodes.social-api-token", token, cookieInfo).json({
      satus: "success",
      statusCode: Status.CREATED,
      data: getNewUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Login
const loginController = async (req, res) => {
  // Joi Validation
  const { error } = validationLoginUser(req.body);

  // If there is any error while validating
  if (error) {
    return res.status(Status.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }

  try {
    const { email, password } = req.body;

    // Check if user email exist in our database
    const user = await UserModel.findOne({ email }).select("+password +isVerified").lean();

    console.log(user);

    if (!user) {
      return res.status(Status.BAD_REQUEST).json({
        message: "Incorrect Credentials",
      });
    }

    // Check if user has verified their account
    if (!user.isVerified) {
      return res.status(Status.BAD_REQUEST).json({
        message: "Your account has not been verified",
      });
    }

    // Check if user password is correct
    if (!(await DataSecurity.compareHash(password, user.password))) {
      return res.status(Status.BAD_REQUEST).json({
        message: "Incorrect Credentials",
      });
    }

    // generate JWT token
    const token = await DataSecurity.generateJWTToken(user.manualId);

    res.status(Status.SUCCESS).cookie("dataqoloToken", token, cookieInfo).json({
      message: "Login successfully",
      user,
    });
  } catch (error) {
    return res.status(Status.SERVER_ERROR).json({
      status: Status.SERVER_ERROR,
      message: `Server: ${error.message}`,
    });
  }
};

module.exports = { loginController, registerController };
