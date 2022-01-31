const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const { authMessages } = require("../helpers/messages");

const { loginEn, notAuthorizedEn } = authMessages;

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(new ErrorResponse(loginEn, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return next(new ErrorResponse(loginEn, 401));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse(loginEn, 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(notAuthorizedEn, 403));
    }
    next();
  };
};
