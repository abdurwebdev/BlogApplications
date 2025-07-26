const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  tags: [String],
  slug: String,
  isPublished: Boolean,
  author: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ FIX HERE
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  publishedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
