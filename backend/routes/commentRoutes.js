
import express from "express";
import Comment from "../models/Comment.js"; // adjust path
const router = express.Router();

// Get comments for a task
router.get("/task/:taskId", async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId });
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
