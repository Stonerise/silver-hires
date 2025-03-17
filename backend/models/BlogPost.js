const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Admin"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);