const mongoose = require("mongoose");
const { jobMessages, companyMessages } = require("../helpers/messages");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  company: {
    type: Schema.Types.ObjectID,
    ref: "companies",
    required: [true, companyMessages.companyRefNotFoundEn],
  },
  description: {
    type: String,
    required: [true, jobMessages.descriptionNotFoundEn],
  },
  city: {
    _id: {
      type: Schema.Types.ObjectID,
      required: [true, jobMessages.cityNameNotFoundEn],
    },
    name: {
      type: String,
      required: [true, jobMessages.cityNameNotFoundEn],
    },
  },
  country: {
    _id: {
      type: Schema.Types.ObjectID,
    },
    name: {
      type: String,
      required: [true, jobMessages.countryNameNotFoundEn],
    },
  },
  companyName: {
    type: String,
    required: [true, jobMessages.companyNameNotFoundEn],
  },
  jobTitle: {
    type: String,
    required: [true, jobMessages.titleNotFoundEn],
  },
  category: {
    _id: {
      type: Schema.Types.ObjectID,
      required: [true, jobMessages.categoryNotFoundEn],
    },
    categoryName: {
      type: String,
    },
    occupationId: {
      type: String,
    },
    occupationAlias: {
      type: String,
    },
  },
  employmentType: {
    type: String,
    required: [true, jobMessages.employmentTypeNotFoundEn],
    enum: ["Full Time", "Part Time", "By Contract", "By Project", "Remote"],
    default: "Full Time",
  },
  status: {
    type: String,
    enum: ["Open", "Applications Closed", "Finalized"],
    default: "Open",
  },
  salaryRange: {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    currency: {
      type: String,
    },
  },
  vacanciesNumber: {
    type: Number,
    default: 1,
  },
  skills: [
    {
      skillName: String,
      skillLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Professional"],
      },
    },
  ],
  academicQualifications: [
    {
      title: String,
      profession: String,
      qualificationLevel: {
        type: String,
        enum: ["SecondarySchool", "University", "Masters", "Phd"],
      },
    },
  ],
  preferredCandidate: [
    {
      careerLevel: {
        type: String,
        enum: ["Junior", "Med Senior", "Senior"],
      },
      profession: String,
      yearsOfExperience: Number,
      gender: {
        type: String,
        enum: ["Male", "Female"],
      },
      degree: String,
    },
  ],
  startApplicationsDates: [
    {
      type: Date,
      default: Date.now,
    },
  ],
  closeApplicationDate: [{ type: Date }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  physicalRequirements: {
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Others"],
    },
    height: String,
    weight: String,
  },
  otherRequirements: [
    {
      key: String,
      value: String,
    },
  ],
});

module.exports = Job = mongoose.model("jobs", JobSchema);
