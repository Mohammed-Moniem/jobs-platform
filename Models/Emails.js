const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  to: String,
  from: String,
  subject: String,
  message: String,
  type: {
    type: String,
    enum: [
      "OTP",
      "RESET-PASSWORD",
      "GENERAL-NOTIFICATIONS",
      "SECURITY-ALERT",
      "JOBS-ANNOUNCEMENTS",
    ],
  },
});

module.exports = Email = mongoose.model("emails", EmailSchema);
