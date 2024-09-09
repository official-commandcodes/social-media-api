const { UserModel } = require("../models/user.model");
const Status = require("../helpers/status-code");
const DataSecurity = require("../helpers/security/data.security");
const SendEmail = require("../helpers/send-mail");
const { validationRegisterUser, validationLoginUser, validateResetPassword } = require("../validation/user.validation");

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
      token,
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
    const user = await UserModel.findOne({ email }).select("+password +isVerified");

    if (!user) {
      return res.status(Status.BAD_REQUEST).json({
        message: "Incorrect Credentials",
      });
    }

    // Check if user has not verified their account
    if (!user.isVerified) {
      // Generate OTP
      const rawOTP = DataSecurity.generateDigit(4);
      const hashedOTP = await DataSecurity.hash(rawOTP);

      // Sending Email
      await new SendEmail(user.email).verifyEmail({ name: user.username, otp: rawOTP });

      // Update user
      user.otp = hashedOTP;
      await user.save();

      // generate JWT token
      const token = await DataSecurity.generateJWTToken(user.manualId); // create token with the manualId(uuid)

      return res
        .status(Status.BAD_REQUEST)
        .cookie("commandcodes.social-api-token", token, cookieInfo)
        .json({
          token: token,
          message: `An OTP has been sent to ${user.email}, to verify your account!`,
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
      token,
    });
  } catch (error) {
    return res.status(Status.SERVER_ERROR).json({
      status: Status.SERVER_ERROR,
      message: error.message,
    });
  }
};

// OTP Verification
const otpVerificationController = async (req, res) => {
  try {
    // if user account has been verified
    if (req.user.isVerified) {
      return res.status(Status.SUCCESS).json({
        status: "success",
        message: "Your account has been successfully verified",
      });
    } else {
      // Check if user provided their otp
      const { otp } = req.body;

      if (!otp) {
        return res.status(Status.BAD_REQUEST).json({
          status: "fail",
          message: "Provide your OTP",
        });
      }

      // Confirm the provided OTP if corrected
      if (!(await DataSecurity.compareHash(otp, req.user.otp))) {
        return res.status(Status.BAD_REQUEST).json({
          status: Status.BAD_REQUEST,
          message: "Incorrect OTP",
        });
      }

      // Invalidate user is_verified field
      req.user.otp = undefined;
      req.user.isVerified = true;
      await req.user.save();

      return res.status(Status.SUCCESS).json({
        status: Status.SUCCESS,
        message: "Email successfully verified",
      });
    }
  } catch (error) {
    return res.status(Status.SERVER_ERROR).json({
      status: Status.SERVER_ERROR,
      message: error.message,
    });
  }
};

// Reset Password
const resetPasswordController = async (req, res) => {
  try {
    const { error } = validateResetPassword(req.body);

    // If there is any error while validating
    if (error) {
      return res.status(Status.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }

    const { newPassword, previousPassword } = req.body;

    if (!(await DataSecurity.compareHash(previousPassword, req.user.password))) {
      return res.status(Status.BAD_REQUEST).json({
        message: "Incorrect previous password",
      });
    }

    // update user password
    req.user.password = newPassword;
    await req.user.save();

    // generate JWT token
    const token = await DataSecurity.generateJWTToken(req.userId);

    res.status(Status.SUCCESS).cookie("dataqoloToken", token, cookieInfo).json({
      satus: "success",
      token,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return res.status(Status.SERVER_ERROR).json({
      message: error.message,
    });
  }
};

module.exports = { loginController, registerController, otpVerificationController, resetPasswordController };
