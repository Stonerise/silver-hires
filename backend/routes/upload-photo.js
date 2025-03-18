const mongoose = require("mongoose");
const User = require("../models/User"); // Adjust path if i need to

// Connect to MongoDB (called by server.js, but included here for safety)
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Export the handler
const handlePhotoUpload = async (req, res) => {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  // Multer adds req.file
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  // Temp URL (replace with AWS cloud storage later)
  const photoUrl = `/uploads/${req.file.filename}`;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, // From authenticateToken
      { photoUrl },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ photoUrl: user.photoUrl });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { handlePhotoUpload };