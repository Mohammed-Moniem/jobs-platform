const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { createOTP } = require("../utils/otp");
const {
  otpTemplate,
  resetPasswordTemplate,
} = require("../views/emailTemplates");
const { authMessages } = require("../Helpers/messages");
const { validateRegister, validateLogin } = require("../validation/auth");
const { is } = require("express/lib/request");
const { compareOTP } = require("../utils/dates");
const { geoDistanceCase } = require("../middleware/geo");

const {
  userFoundEn,
  verificationEmailSubject,
  userNotFoundEn,
  credentialProblemEn,
  otpExpiryEn,
  emailNotValidEn,
  wrongPasswordEn,
  emailCouldNotBeSent,
  invalidToken,
  otpCreationProblemEn,
  otpNotFoundEn,
  otpVerificationEn,
} = authMessages;
// GET GET GET GET GET GET GET GET GET GET GET GET GET GET

//@Desc   Get Current logged in user
//@route  POST /api/v1/auth/my-account
//@access Public
exports.getMyAccount = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});

// POST POST POST POST POST POST POST POST POST POST POST POST POST POST

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { errors, isValid } = validateRegister(req.body);
  if (!isValid) {
    for (let key in errors) {
      if (errors[key]) return next(new ErrorResponse(errors[key], 400));
    }
  }
  const checkUser = await User.findOne({
    email: req.body.email.trim().toLowerCase().replace(/\s/g, ""),
  });
  if (checkUser) {
    return next(new ErrorResponse(userFoundEn, 400));
  }
  const code = createOTP();
  //Request body must include geolocation
  const user = await User.create({
    ...req.body,
    email: req.body.email.trim().toLowerCase().replace(/\s/g, ""),
    otp: { code },
  });

  try {
    await sendOTP(
      req.body.email.trim().toLowerCase().replace(/\s/g, ""),
      code,
      next
    );
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(otpCreationProblemEn, 400));
  }

  sendTokenResponse(user, 200, res);
});

//@Desc   Verify user account
//@route  GET /api/v1/auth/verify-my-account
//@access Private
exports.verifyAccount = asyncHandler(async (req, res, next) => {
  if (!req.body.otp) {
    return next(new ErrorResponse(otpNotFoundEn, 400));
  }
  const user = await User.findOne({
    email: req.user.email.trim().toLowerCase().replace(/\s/g, ""),
  });
  if (!user) {
    return next(new ErrorResponse(userNotFoundEn, 401));
  }
  user.isVerified = true;
  user.otp = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

//@Desc   Resend account otp
//@route  GET /api/v1/auth/resend-otp
//@access Private
exports.resendOTPCode = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email.trim().toLowerCase().replace(/\s/g, ""),
  });
  if (!user || user.isVerified) {
    return next(new ErrorResponse(otpVerificationEn, 401));
  }
  const code = createOTP();
  user.otp.code = code;
  user.otp.date = new Date();
  await user.save();
  try {
    await sendOTP(
      req.body.email.trim().toLowerCase().replace(/\s/g, ""),
      code,
      next
    );
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(otpCreationProblemEn, 400));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@Desc   Login Users
//@route  GET /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    for (let key in errors) {
      if (errors[key]) return next(new ErrorResponse(errors[key], 400));
    }
  }

  const { email, password, geoLocation } = req.body;
  const user = await User.findOne({
    email: email.trim().toLowerCase().replace(/\s/g, ""),
  }).select({ password: 1, loginIPs: 1, email: 1, phoneNumber: 1 });

  if (!user) {
    return next(new ErrorResponse(userNotFoundEn, 404));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(credentialProblemEn, 401));
  }
  const ips = user.loginIPs.IPs.map((ip) => {
    if (ip.isTrusted) return ip.IPv4;
  });
  console.log({ ips });
  if (!ips.includes(geoLocation.IPv4))
    await geoDistanceCase(geoLocation, user._id, next);

  if (!user.isVerified) {
    const otpExpiry = compareOTP(user.otp.date);
    if (process.env.OTP_EXPIRY <= otpExpiry) {
      return next(new ErrorResponse(otpExpiryEn, 401));
    }
  }
  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logoutOfAllDevices = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT

// @desc      Update user details
// @route     PUT /api/v1/auth/update-details
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { errors, isValid } = validateRegister(req.body);
  if (!isValid) {
    for (let key in errors) {
      if (errors[key]) return next(new ErrorResponse(errors[key], 400));
    }
  }
  const fieldsToUpdate = {
    phoneNumber: req.body.phoneNumber,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user email
// @route     PUT /api/v1/auth/update-email
// @access    Private
exports.updateEmail = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse(emailNotValidEn, 400));
  }
  const emailExistence = await User.findOne({
    email: req.body.email.trim().toLowerCase().replace(/\s/g, ""),
  });
  if (!emailExistence) {
    return next(new ErrorResponse(userFoundEn, 400));
  }
  const code = createOTP();
  await sendOTP(email.trim().toLowerCase().replace(/\s/g, ""), code, next);

  const fieldsToUpdate = {
    email: email.trim().toLowerCase().replace(/\s/g, ""),
    otp: { code, date: new Date() },
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/update-password
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(wrongPasswordEn, 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgot-password
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email.trim().toLowerCase().replace(/\s/g, ""),
  });
  if (!user) {
    return next(new ErrorResponse(userNotFoundEn, 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/my-domain/reset-password/${resetToken}`;
  const html = resetPasswordTemplate(resetUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      html,
      type: "RESET-PASSWORD",
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(emailCouldNotBeSent, 500));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/reset-password/:resetToken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select({ password: 1, perviousPasswords: 1 });
  if (!user) {
    return next(new ErrorResponse(invalidToken, 400));
  }
  user.perviousPasswords.passwords.push({
    password: user.password,
    resetDate: new Date(),
  });
  //Check previous passwords
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS HELPERS
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  user.password = undefined;
  user.perviousPasswords = undefined;
  user.loginIPs = undefined;
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};

const sendOTP = async (email, code, next) => {
  const html = otpTemplate(code);
  await sendEmail(
    {
      email,
      subject: verificationEmailSubject,
      html,
      type: "OTP",
    },
    next
  );
  next();
};
