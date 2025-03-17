const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const BlogPost = require("../models/BlogPost");
const User = require("../models/User");

const router = express.Router();

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).send("Server Error");
  }
});

// Get a single blog post
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).send("Server Error");
  }
});

// Create a blog post (admin only)
router.post(
  "/",
  [
    authMiddleware,
    body("title").not().isEmpty().withMessage("Title is required"),
    body("content").not().isEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is admin
      const user = await User.findById(req.user.id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ msg: "Not authorized to create blog posts" });
      }

      const { title, content, author } = req.body;

      const newPost = new BlogPost({
        title,
        content,
        author: author || user.name,
      });

      await newPost.save();
      res.json(newPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).send("Server Error");
    }
  }
);

// Update a blog post (admin only)
router.put(
  "/:id",
  [
    authMiddleware,
    body("title").not().isEmpty().withMessage("Title is required"),
    body("content").not().isEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is admin
      const user = await User.findById(req.user.id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ msg: "Not authorized to update blog posts" });
      }

      const { title, content, author } = req.body;

      const updatedPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          author: author || user.name,
        },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ msg: "Blog post not found" });
      }

      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).send("Server Error");
    }
  }
);

// Delete a blog post (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: "Not authorized to delete blog posts" });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    await post.remove();
    res.json({ msg: "Blog post removed" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;