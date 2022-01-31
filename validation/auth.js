const Validator = require("validator");
const { authMessages } = require("../Helpers/messages");
const isEmpty = require("./is-empty");

module.exports.validateRegister = (data) => {
  const { email, password, password2, phoneNumber, role } = data;
  const {
    emailNotValidEn,
    passwordNotValidEn,
    passwordLengthEn,
    confirmPasswordEn,
    phoneNumberNotValidEn,
    roleNotValidEn,
  } = authMessages;
  let errors = {};

  email = !isEmpty(email) ? email : "";
  if (Validator.isEmpty(email)) {
    errors.email = `${emailNotValidEn}`;
  }
  if (!Validator.whitelist(email, /^[\w\d-.]+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/)) {
    errors.email = `${emailNotValidEn}`;
  }

  if (!Validator.isLength(email, { min: 8, max: 50 })) {
    errors.email = `${emailNotValidEn}`;
  }

  password = !isEmpty(password) ? password : "";

  if (Validator.isEmpty(password)) {
    errors.password = `${passwordNotValidEn}`;
  }

  if (!Validator.isLength(password, { min: 8, max: 50 })) {
    errors.password = `${passwordLengthEn}`;
  }

  password2 = !isEmpty(password2) ? password2 : "";

  if (Validator.isEmpty(password2)) {
    errors.password2 = `${confirmPasswordEn}`;
  }

  if (!Validator.equals(password, password2)) {
    errors.password = `${confirmPasswordEn}`;
  }

  phoneNumber = !isEmpty(phoneNumber) ? phoneNumber : "";

  if (Validator.isEmpty(phoneNumber)) {
    errors.phoneNumber = `${phoneNumberNotValidEn}`;
  }

  if (!Validator.isLength(phoneNumber, { min: 9, max: 14 })) {
    errors.phoneNumber = `${phoneNumberNotValidEn}`;
  }

  role = !isEmpty(role) ? role : "";

  if (Validator.isEmpty(role)) {
    errors.role = `${roleNotValidEn}`;
  }

  if (!Validator.isIn(role, ["Admin", "Seeker", "Company"])) {
    errors.role = `${roleNotValidEn}`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports.validateLogin = (data) => {
  const { email, password } = data;
  const { credentialProblemEn } = authMessages;
  let errors = {};

  email = !isEmpty(email) ? email : "";
  if (Validator.isEmpty(email)) {
    errors.email = `${credentialProblemEn}`;
  }
  if (!Validator.whitelist(email, /^[\w\d-.]+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/)) {
    errors.email = `${credentialProblemEn}`;
  }
  password = !isEmpty(password) ? password : "";

  if (Validator.isEmpty(password)) {
    errors.password = `${credentialProblemEn}`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
