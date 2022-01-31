const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuditSchema = new Schema({
  user: mongoose.SchemaTypes.Mixed,
  method: String,
  url: String,
  params: mongoose.SchemaTypes.Mixed,
  query: mongoose.SchemaTypes.Mixed,
  body: mongoose.SchemaTypes.Mixed,
  statusCode: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Audit = mongoose.model("audits", AuditSchema);
