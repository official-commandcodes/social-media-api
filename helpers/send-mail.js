const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

class SendEmail {
  constructor(email) {
    this.email = email;
  }

  #transporter() {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async #createEmailTemplateAndSend(subject, templateName, payload) {
    const source = fs.readFileSync(path.join(__dirname, `./templates/${templateName}.handlebars`), "utf8");
    const compiledTemplate = handlebars.compile(source); // Another templating engine could be used

    const data = {
      from: process.env.EMAIL,
      to: this.email,
      subject: subject,
      html: compiledTemplate(payload),
    };

    this.#transporter().sendMail(data, (error, info) => {
      if (error) {
        throw error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  }

  // Verify Email: payload-> name & OTP
  async verifyEmail(data) {
    await this.#createEmailTemplateAndSend("Verification Email", "verifyEmail", data);
  }

  // Reset password
  async resetPassword(data) {
    await this.#createEmailTemplateAndSend("Reset Password", "resetPassword", data);
  }
}

module.exports = SendEmail;
