const express = require("express");
const router = express.Router();

const { loginController, registerController, otpVerificationController, resetPasswordController } = require("../controllers/user.controller");
const protect = require("../middlewares/protect");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/otp-verification", protect, otpVerificationController);
router.post("/reset-password", protect, resetPasswordController);

module.exports = router;
