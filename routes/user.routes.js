const express = require("express");
const router = express.Router();

const { loginController, registerController, otpVerificationController, resetPasswordController } = require("../controllers/user.controller");
const protect = require("../middlewares/protect");

/**
 * @swagger
 * /api/register:
 *  post:
 *    requestBody:
 *      description: Create a new user account by providing necessary information - username, email, and password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *               - username
 *               - email
 *               - password
 *            properties:
 *               username:
 *                 type: string
 *                 example: Musa Abdulkabeer
 *               email:
 *                 type: string
 *                 format: email
 *                 example:  musaabdulkabeer19@gmail.com
 *                 description: User's email address (The email will be validate if it's indeed in email format)
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: A strong password for the account. The password must be 6 character at the least
 *    responses:
 *     201:
 *       description: Account created successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               token:
 *                 type: string
 *                 example:
 *     400:
 *       description: Bad request, missing or invalid fields (username, email, password) OR user already exist
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: User already exist
 *     500:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Unable to create account at this time
 */
router.post("/register", registerController);
/**
 * @swagger
 * /api/login:
 *  post:
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *               - email
 *               - password
 *            properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: musaabdulkabeer19@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *    responses:
 *     201:
 *       description: Account created successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: success
 *               token:
 *                 type: string
 *                 example:
 *     400:
 *       description: Bad request, missing or invalid fields (username, email, password) OR user already exist
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: User already exist
 *     500:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Unable to create account at this time
 */
router.post("/login", loginController);
router.post("/otp-verification", protect, otpVerificationController);
router.post("/reset-password", protect, resetPasswordController);

module.exports = router;
