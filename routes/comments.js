const express = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.error = 'Please log in to add a comment.';
  res.redirect('/login');
};

// Create new comment
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { text, postId } = req.body;
    
    if (!text || !postId) {
      req.session.error = 'Comment text and post ID are required.';
      return res.redirect('back');
    }
    
    if (text.trim().length === 0) {
      req.session.error = 'Comment cannot be empty.';
      return res.redirect('back');
    }
    
    if (text.length > 1000) {
      req.session.error = 'Comment cannot exceed 1000 characters.';
      return res.redirect('back');
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      req.session.error = 'Post not found.';
      return res.redirect('/');
    }
    
    const comment = new Comment({
      text: text.trim(),
      author: req.user._id,
      post: postId
    });
    
    await comment.save();
    req.session.success = 'Comment added successfully!';
    res.redirect(`/posts/${postId}`);
    
  } catch (error) {
    console.error('Error creating comment:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.session.error = messages.join(', ');
    } else {
      req.session.error = 'Error adding comment. Please try again.';
    }
    res.redirect('back');
  }
});

// Delete comment (only by the author)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      req.session.error = 'Comment not found.';
      return res.redirect('back');
    }
    
    // Check if user is the author of the comment
    if (!comment.author.equals(req.user._id)) {
      req.session.error = 'You are not authorized to delete this comment.';
      return res.redirect('back');
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    req.session.success = 'Comment deleted successfully!';
    res.redirect(`/posts/${comment.post}`);
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    req.session.error = 'Error deleting comment. Please try again.';
    res.redirect('back');
  }
});

module.exports = router;

