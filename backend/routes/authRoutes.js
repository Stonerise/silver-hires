const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
const multer = require("multer");

const uploadPhoto = require("./upload-photo");

const upload = multer({ dest: "uploads/" });  // temporary destination, vercel should not persist

router.post(
  "/upload-photo", 
  authenticateToken, 
  upload.single("photo"),
  uploadPhoto.handlePhotoUpload
);

// Register Route (Without Email Verification)
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/\d/).withMessage("Password must contain at least one number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, location, gender, dateOfBirth, isEmployer } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user without email verification
      user = new User({ name, email, password: hashedPassword, isVerified: true, phone, location, gender, dateOfBirth, isEmployer }); // Auto-verify
      await user.save();

      // Generate JWT Token
      const payload = { id: user.id, isEmployer: user.isEmployer };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6d" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error("Registration error:", error.message);
      res.status(500).send("Server Error");
    }
  }
);


// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/\d/).withMessage("Password must contain at least one number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Generate JWT Token
      const payload = { id: user.id, isEmployer: user.isEmployer };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6d" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// Get Employer Profile
router.get("/employer-profile", authenticateToken, async (req, res) => {
  try {
    const employer = await User.findById(req.user.id).select("name email");
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }
    res.json(employer);
  } catch (error) {
    console.error("Error fetching employer profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// this route to get user profile
router.get("/user-profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// this route to update user profile
router.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, location, gender, dateOfBirth } = req.body;
    
    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (phone) userFields.phone = phone;
    if (location) userFields.location = location;
    if (gender) userFields.gender = gender;
    if (dateOfBirth) userFields.dateOfBirth = dateOfBirth;
    
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    // Update user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select("-password");
    
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
