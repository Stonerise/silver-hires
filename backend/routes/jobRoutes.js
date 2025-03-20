const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes
const Job = require("../models/Job");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create a Job Post (Employer OR Job Seeker)
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    const { isEmployer } = req.body;

    // Validation Rules
    let validationRules = [];
    
    if (isEmployer) {
      // Employer post validation
      validationRules = [
        body("title").not().isEmpty().withMessage("Job Title is required"),
        body("location").not().isEmpty().withMessage("Location is required"),
        body("description").not().isEmpty().withMessage("Description is required"),
        body("qualifications").not().isEmpty().withMessage("Qualifications are required"),
        body("salary").not().isEmpty().withMessage("Salary is required"),
        body("type").isIn(["Full-time", "Part-time", "Remote"]).withMessage("Invalid job type"),
      ];
    } else {
      // Job Seeker post validation
      validationRules = [
        body("subject").not().isEmpty().withMessage("Subject is required"),
        body("whatICanDoForYou").not().isEmpty().withMessage("This field is required"),
        body("pastExperience").not().isEmpty().withMessage("Past experience is required"),
        body("bio").not().isEmpty().withMessage("Bio is required"),
        body("expectations").not().isEmpty().withMessage("Expectations are required"),
        body("preferredType").isIn(["Full-time", "Part-time", "Remote"]).withMessage("Invalid preferred type"),
      ];
    }

    // Run validation
    await Promise.all(validationRules.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let newJob;
      if (isEmployer) {
        newJob = new Job({
          user: req.user.id,
          isEmployer: true,
          title: req.body.title,
          location: req.body.location,
          description: req.body.description,
          qualifications: req.body.qualifications,
          whatWeDoForYou: req.body.whatWeDoForYou,
          salary: req.body.salary,
          type: req.body.type,
        });
      } else {
        newJob = new Job({
          user: req.user.id,
          isEmployer: false,
          subject: req.body.subject,
          whatICanDoForYou: req.body.whatICanDoForYou,
          pastExperience: req.body.pastExperience,
          bio: req.body.bio,
          expectations: req.body.expectations,
          preferredType: req.body.preferredType,
        });
      }

      await newJob.save();
      res.json(newJob);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get All Job Posts (Both Employer & Job Seeker)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get Jobs Posted by Employer
router.get("/employer-jobs", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching Jobs for Employer ID:", req.user.id);

    // DEBUG: Log full request object
    console.log("Full Request Object:", req);

    // Ensure employer ID is correctly extracted
    console.log("Extracted Employer ID from Token", req.user ? req.user.id : "undefined");

    if (!req.user || !req.user.id) {
      console.log("ERROR: Employer ID is missing!");
      return res.status(400).json({ msg: "Employer ID is missing" });
    }

    // DEBUG: Log the query before MongoDB executes
    console.log("Running Query: { user: ", req.user.id, " }");


    // query MongoDB
    const jobs = await Job.find({ user: req.user.id }); // Ensure user ID is used
    console.log("Jobs Found:", jobs.length);
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

// Get a Single Job Post by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a Job Post (Only the Creator Can Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await job.remove();
    res.json({ msg: "Job removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


router.post("/create", authMiddleware, async (req, res) => {
  const { title, location, salary, description, qualifications } = req.body;

  if (!title || !location || !salary || !description || !qualifications) {
    return res.status(400).json({ msg: "Please provide all job details (title, location, salary, description, qualifications)" });
  }

  try {
    console.log("Creating Job...");
    console.log("Employer ID:", req.user.id);
    console.log("Job Data:", { title, location, salary, description, qualifications });
    
    const newJob = new Job({
      title,
      location,
      salary,
      description,
      qualifications,
      isEmployer: true,
      user: req.user.id, // Attach employer ID
    });

    await newJob.save();
    console.log("Job Created Successfully:", newJob);
    res.json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});



module.exports = router;
