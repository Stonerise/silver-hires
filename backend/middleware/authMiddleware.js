const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("Incoming Auth Request..."); // Debugging log

  // Get token from header
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader); // Log the raw header

  if (!authHeader) {
    console.error("No token found in request");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // Log the token value

  if (!token) {
    console.error("Token is missing after split");
    return res.status(401).json({ msg: "Token format invalid" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // env variable
    console.log("Token Decoded:", decoded);
    req.user = decoded.user; // matches { user: { id } } from login
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
