const express = require("express");
const {
  getMyAccount,
  register,
  verifyAccount,
  resendOTPCode,
  login,
  logout,
  updateDetails,
  updateEmail,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.post("/forgot-password", forgotPassword);
router.post("/login", login);
router.post("/logout", logout);
router.get("/my-account", protect, getMyAccount);
router.post("/register", register);
router.post("/resend-otp", resendOTPCode);
router.post("/reset-password/:resetToken", resetPassword);
router.put("/update-details", protect, updateDetails);
router.put("/update-email", protect, updateEmail);
router.put("/update-password", protect, updatePassword);
router.put("/verify-my-account", protect, verifyAccount);

module.exports = router;
