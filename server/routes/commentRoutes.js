const express = require('express');
const router = express.Router();
const Comment = require('../models/commentModel');
const verifyToken = require('../middleware/authMiddleware');
const userModel = require('../models/user'); 
// Get all comments for a post
router.get('/comment/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

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
    console.error("❌ Failed to create comment:", err); // 🔍 ADD THIS
    res.status(500).json({ error: 'Failed to create comment' });
  }
});


// Update comment
router.put('/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.user.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    comment.content = req.body.content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Error updating comment' });
  }
});

// Delete comment
router.delete('/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.user.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

module.exports = router;
