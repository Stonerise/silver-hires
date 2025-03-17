const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
  },
  location: {
    city: String,
    country: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: {
    type: Date
  },
  isEmployer: {
    type: Boolean,
    default: false // Default to job seeker
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photoUrl: { 
    type: String 
  }
});

module.exports = mongoose.model("User", UserSchema);
