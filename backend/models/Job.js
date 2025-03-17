const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  qualifications: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isEmployer: { type: Boolean, required: true }, // True = Employer posting, False = Job Seeker posting
  
  // Fields for Employer Posts
  whatWeDoForYou: { type: String }, // Only for employers
  type: { type: String, enum: ["Full-time", "Part-time", "Remote"] },

  // Fields for Job Seeker Posts
  subject: { type: String },
  whatICanDoForYou: { type: String },
  pastExperience: { type: String },
  bio: { type: String },
  expectations: { type: String },
  preferredType: { type: String, enum: ["Full-time", "Part-time", "Remote"] },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
