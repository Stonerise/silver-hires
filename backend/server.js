require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./routes/authRoutes");
console.log("Auth Routes Loaded"); // debuggin log

const jobRoutes = require("./routes/jobRoutes");
console.log("Job Routes Loaded"); // debugging log

const applicationRoutes = require("./routes/applicationRoutes");
console.log("Application Routes Loaded"); // debugging log

const blogRoutes = require("./routes/blogRoutes");
console.log("Blog Routes Loaded"); // debugging log

// Register Routes 
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes); 
app.use("/api/blog-posts", blogRoutes);
console.log("/api/applications Route Mounted");

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((error) => console.error("MongoDB Atlas Connection Error:", error));

// Test route
app.get("/", (req, res) => {
    res.send("Job Portal API Running!");
});

// Debugging: Log Registered Routes 
console.log("Registered Routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});


app.get("/test", (req, res) => {
    res.send("✅ Express is working!");
  });

// Start Server  (Fixed Backticks)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
