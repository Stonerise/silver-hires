const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicantName: {
    type: String,
    required: true,
  },
  applicantEmail: {
    type: String,
    required: true,
  },
  applicantPhone: {
    type: String,
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  coverLetterUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
