const authenticateToken = require("../middleware/authMiddleware");
const express = require("express");
const multer = require("multer");
const path = require("path");
const Application = require("../models/Application");
const Job = require("../models/Job");

const router = express.Router();

// Multer storage config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST: Submit job application
router.post("/", authenticateToken, async (req, res) => {
    console.log("Received Form Data:", req.body); // Debugging log
  const { jobId, applicantName, applicantEmail, applicantPhone } = req.body;

  if (!req.files || !req.files.resume || !req.files.coverLetter) {
    return res.status(400).json({ message: "Resume and Cover Letter are required" });
  }

  try {
    const application = new Application({
      jobId,
      applicantName,
      applicantEmail,
      applicantPhone,
      resumeUrl: "TEMP_RESUME_URL",
      coverLetterUrl: "TEMP_COVERLETTER_URL",
      // following line to include user ID if authenticated
      ...(req.user && { userId: req.user.id })
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// GET all applications for an employer
router.get("/employer/applications", authenticateToken, async (req, res) => {
  const employerId = req.user.id; // Get employer ID from token

  try {
    // Find all jobs posted by the employer
    const jobs = await Job.find({ employerId });
    const jobIds = jobs.map(job => job._id);

    // Find all applications related to the employer's jobs
    const applications = await Application.find({ jobId: { $in: jobIds } });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Add this route to get applications for a user
router.get("/user-applications", authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId', 'title employerName')
      .sort({ createdAt: -1 });
    
    // Transform data to include job details
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      jobTitle: app.jobId ? app.jobId.title : 'Job no longer available',
      employerName: app.jobId ? app.jobId.employerName : 'Unknown',
      createdAt: app.createdAt,
      status: app.status || 'Pending'
    }));
    
    res.json(formattedApplications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

module.exports = router;

console.log("applicationRoutes.js is being used");
console.log("Routes Defined in applicationRoutes:");
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${r.route.stack[0].method.toUpperCase()} /api/applications${r.route.path}`);
  }
});
