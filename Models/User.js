const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const { usersMessages } = require("../Helpers/messages");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      usersMessages.emailNotFoundEn,
    ],
    // required: [true],
  },
  password: {
    type: String,
    // required: [true, usersMessages.passwordNotFoundEn],
    minlength: 6,
    maxlength: 255,
    select: false,
  },
  //move to resume
  phoneNumber: {
    type: Number,
    // required: [true, usersMessages.phoneNumberNotFoundEn],
    // unique: [true],
    match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/],
  },
  otp: {
    code: String,
    date: { type: Date, default: Date.now },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  logoutOfAllDevices: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Seeker", "Company"],
    default: "Seeker",
    // required: [true, usersMessages.roleNotFoundEn],
  },
  perviousPasswords: {
    passwords: [
      {
        password: String,
        resetDate: Date,
      },
    ],
    select: false,
  },
  loginIPs: {
    IPs: [
      {
        IPv4: String,
        loginDate: Date,
        isTrusted: Boolean,
        longitude: String,
        latitude: String,
        city: String,
        countryName: String,
        countryCode: String,
      },
    ],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.plugin(uniqueValidator, {
  message: ` ( {PATH} ) ${usersMessages.uniqueValidatorEn} `,
});

module.exports = User = mongoose.model("users", UserSchema);
