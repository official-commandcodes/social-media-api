const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class DataSecurity {
  /**
   * Hashes the provided password using bcrypt.
   * @param {string} password - The password to hash.
   * @param {number} saltRounds - The number of rounds to use for generating the salt.
   * @returns {Promise<string>} - A promise that resolves to the hashed password.
   */
  static async hash(plain, saltRounds = 10) {
    return await bcrypt.hash(plain, saltRounds);
  }

  /**
   * @param {string} number
   * @returns {string} - return random digit numbers
   */
  static generateDigit(number) {
    const buff = crypto.randomBytes(3);
    return parseInt(buff.toString("hex"), 16).toString().substr(0, number);
  }

  /**
   * @param {string} userId - user id to create jwt token
   * @returns {Promise<string>} - return JWT Token
   */
  static async generateJWTToken(userId) {
    try {
      if (!userId) throw new Error("Invalidate id to generate JWT");

      return await jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {string} rawPassword - The plain user password
   * @param {string} hashedPassword - The database hashed password
   * @returns {Promise<boolean>} - A promise that resolves to the hashed password.
   */
  static async compareHash(rawPassword, hashedPassword) {
    try {
      return await bcrypt.compare(rawPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DataSecurity;
