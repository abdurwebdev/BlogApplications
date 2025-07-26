const express = require('express');
const router = express.Router();
const Comment = require('../models/commentModel');
const verifyToken = require('../middleware/authMiddleware');

// Get comments for a post
router.get('/comment/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Post a comment
router.post('/comment/:postId', verifyToken, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      user: req.user._id,
      post: req.params.postId,
    });
    const populated = await newComment.populate('user', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Delete a comment ✅ FIXED model name
router.delete('/comment/delete/:id',verifyToken, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

// Update a comment ✅ FIXED model name
router.put('/comment/update/:id',verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.content = req.body.content;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: 'Error updating comment' });
  }
});

module.exports = router;
