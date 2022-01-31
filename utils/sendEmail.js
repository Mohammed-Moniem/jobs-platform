const nodemailer = require("nodemailer");
const { authMessages } = require("../Helpers/messages");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const sendEmail = asyncHandler(async (options, next) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  });
  try {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message ? options.message : undefined,
      html: options.html ? options.html : undefined,
    };
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(authMessages.otpCreationProblemEn, 400));
  }
});
module.exports = sendEmail;
