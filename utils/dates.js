module.exports.compareOTP = (otpCreationDate) => {
  const today = new Date();
  const diffDays = parseInt((today - otpCreationDate) / (1000 * 60 * 60 * 24));
  return diffDays;
};
