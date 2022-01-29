const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectID,
    ref: "users",
  },
  currentCity: {
    _id: {
      type: Schema.Types.ObjectID,
      required: [true, jobMessages.cityNameNotFoundEn],
    },
    name: {
      type: String,
      required: [true, jobMessages.cityNameNotFoundEn],
    },
  },
  currentCountry: {
    _id: {
      type: Schema.Types.ObjectID,
    },
    name: {
      type: String,
      required: [true, jobMessages.countryNameNotFoundEn],
    },
  },
  avatar: String,
  bio: String,
  readyToWork: Boolean,
  readyToRelocate: Boolean,
  experiences: [
    {
      jobTitle: String,
      companyName: String,
      start: Date,
      end: Date,
      current: Boolean,
      description: String,
      city: {
        _id: Schema.Types.ObjectID,
        name: String,
      },
      country: {
        _id: Schema.Types.ObjectID,
        name: String,
      },
    },
  ],
  education: [
    {
      instituteName: String,
      degree: String,
      start: Date,
      end: Date,
    },
  ],
  skills: [
    {
      name: String,
    },
  ],
  awards: [
    {
      name: String,
      date: Date,
      instituteName: String,
      description: String,
      link: String,
    },
  ],
  groups: [
    {
      name: String,
      start: Date,
      end: Date,
      description: String,
      link: String,
    },
  ],
  languages: [
    {
      name: String,
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Fluent", "Native"],
      },
    },
  ],
  links: [String],
  desiredJobTypes: {
    type: String,
    enum: ["Full Time", "Part Time", "By Contract", "By Project", "Remote"],
  },
});

module.exports = Resume = mongoose.model("resumes", ResumeSchema);
