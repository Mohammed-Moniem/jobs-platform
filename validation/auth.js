const Validator = require("validator");
const { authMessages } = require("../Helpers/messages");
const isEmpty = require("./is-empty");

module.exports.validateRegister = (data) => {
  const {
    emailNotValidEn,
    passwordNotValidEn,
    passwordLengthEn,
    confirmPasswordEn,
    phoneNumberNotValidEn,
    roleNotValidEn,
  } = authMessages;
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  if (Validator.isEmpty(data.email)) {
    errors.email = `${emailNotValidEn}`;
  }
  if (
    !Validator.whitelist(data.email, /^[\w\d-.]+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/)
  ) {
    errors.email = `${emailNotValidEn}`;
  }

  if (!Validator.isLength(data.email, { min: 8, max: 50 })) {
    errors.email = `${emailNotValidEn}`;
  }

  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = `${passwordNotValidEn}`;
  }

  if (!Validator.isLength(data.password, { min: 8, max: 50 })) {
    errors.password = `${passwordLengthEn}`;
  }

  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = `${confirmPasswordEn}`;
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password = `${confirmPasswordEn}`;
  }

  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = `${phoneNumberNotValidEn}`;
  }

  if (!Validator.isLength(data.phoneNumber, { min: 9, max: 14 })) {
    errors.phoneNumber = `${phoneNumberNotValidEn}`;
  }

  data.role = !isEmpty(data.role) ? data.role : "";

  if (Validator.isEmpty(data.role)) {
    errors.role = `${roleNotValidEn}`;
  }

  if (!Validator.isIn(data.role, ["Admin", "Seeker", "Company"])) {
    errors.role = `${roleNotValidEn}`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports.validateLogin = (data) => {
  const { credentialProblemEn } = authMessages;
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  if (Validator.isEmpty(data.email)) {
    errors.email = `${credentialProblemEn}`;
  }
  if (
    !Validator.whitelist(data.email, /^[\w\d-.]+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/)
  ) {
    errors.email = `${credentialProblemEn}`;
  }
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = `${credentialProblemEn}`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
