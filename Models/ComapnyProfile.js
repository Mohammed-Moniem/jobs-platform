const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const { companyMessages } = require("../helpers/messages");

const CompanySchema = new Schema({
  name: {
    type: String,
    required: [true, companyMessages.nameNotFoundEn],
    unique: [true, companyMessages.uniqueNameEn],
  },
  location: {
    type: String,
    required: [true, companyMessages.locationNotFoundEn],
  },
  phoneNumber: {
    type: String,
    required: [true, companyMessages.phoneNumberNotFoundEn],
  },
  email: {
    type: String,
    required: [true, companyMessages.emailNotFoundEn],
  },
  averageRating: {
    type: Number,
    min: [1, companyMessages.ratingLessThanOneNotFoundEn],
    max: [10, companyMessages.ratingMoreThanTenNotFoundEn],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  logo: String,
  numberOfBranches: Number,
  numberOfStaff: Number,
  bio: String,
  phoneNumber2: String,
  fixedPhoneNumber: String,
  website: String,
  establishmentDate: Date,
  workingDaysAndHours: {
    saturday: String,
    sunday: String,
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
  },
  socialLinks: {
    youTube: String,
    twitter: String,
    facebook: String,
    linkedIn: String,
    instagram: String,
  },
});

// Prevent user from submitting more than one agency profile
CompanySchema.index({ user: 1 }, { unique: true });
//Validation Error Message
CompanySchema.plugin(uniqueValidator, {
  message: ` ( {PATH} ) ${companyMessages.uniqueNameEn} `,
});

module.exports = Company = mongoose.model("companies", CompanySchema);
