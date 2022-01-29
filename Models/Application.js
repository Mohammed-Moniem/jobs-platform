const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectID,
    ref: "users",
  },
  job: {
    type: Schema.Types.ObjectID,
    ref: "jobs",
  },
  resume: {
    type: Schema.Types.ObjectID,
    ref: "resumes",
  },
});

module.exports = Application = mongoose.model(
  "applications",
  ApplicationSchema
);
