const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.error = 'Please log in to access this page.';
  res.redirect('/login');
};

// Middleware to check if user is the author of the post
const isAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.session.error = 'Post not found.';
      return res.redirect('/');
    }
    if (!post.author.equals(req.user._id)) {
      req.session.error = 'You are not authorized to perform this action.';
      return res.redirect('/');
    }
    req.post = post;
    next();
  } catch (error) {
    console.error('Error checking post ownership:', error);
    req.session.error = 'Error accessing post.';
    res.redirect('/');
  }
};

// Show all posts (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    
    res.render('posts/index', {
      posts,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      title: 'All Posts'
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    req.session.error = 'Error loading posts.';
    res.redirect('/');
  }
});

// New post form (MUST come before /:id route)
router.get('/new', isAuthenticated, (req, res) => {
  res.render('posts/new', {
    title: 'Create New Post'
  });
});

// Show single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    
    if (!post) {
      req.session.error = 'Post not found.';
      return res.redirect('/');
    }
    
    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.render('posts/show', {
      post,
      comments,
      title: post.title
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    req.session.error = 'Error loading post.';
    res.redirect('/');
  }
});

// Create new post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      req.session.error = 'Title and content are required.';
      return res.redirect('/posts/new');
    }
    
    if (title.length > 200) {
      req.session.error = 'Title cannot exceed 200 characters.';
      return res.redirect('/posts/new');
    }
    
    if (content.length < 10) {
      req.session.error = 'Content must be at least 10 characters long.';
      return res.redirect('/posts/new');
    }
    
    const post = new Post({
      title,
      content,
      author: req.user._id
    });
    
    await post.save();
    req.session.success = 'Post created successfully!';
    res.redirect(`/posts/${post._id}`);
    
  } catch (error) {
    console.error('Error creating post:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.session.error = messages.join(', ');
    } else {
      req.session.error = 'Error creating post. Please try again.';
    }
    res.redirect('/posts/new');
  }
});

// Edit post form
router.get('/:id/edit', isAuthenticated, isAuthor, (req, res) => {
  res.render('posts/edit', {
    post: req.post,
    title: 'Edit Post'
  });
});

// Update post
router.put('/:id', isAuthenticated, isAuthor, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      req.session.error = 'Title and content are required.';
      return res.redirect(`/posts/${req.params.id}/edit`);
    }
    
    if (title.length > 200) {
      req.session.error = 'Title cannot exceed 200 characters.';
      return res.redirect(`/posts/${req.params.id}/edit`);
    }
    
    if (content.length < 10) {
      req.session.error = 'Content must be at least 10 characters long.';
      return res.redirect(`/posts/${req.params.id}/edit`);
    }
    
    req.post.title = title;
    req.post.content = content;
    req.post.updatedAt = new Date();
    
    await req.post.save();
    req.session.success = 'Post updated successfully!';
    res.redirect(`/posts/${req.post._id}`);
    
  } catch (error) {
    console.error('Error updating post:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.session.error = messages.join(', ');
    } else {
      req.session.error = 'Error updating post. Please try again.';
    }
    res.redirect(`/posts/${req.params.id}/edit`);
  }
});

// Delete post
router.delete('/:id', isAuthenticated, isAuthor, async (req, res) => {
  try {
    // Also delete all comments associated with this post
    await Comment.deleteMany({ post: req.post._id });
    
    await Post.findByIdAndDelete(req.post._id);
    req.session.success = 'Post deleted successfully!';
    res.redirect('/');
    
  } catch (error) {
    console.error('Error deleting post:', error);
    req.session.error = 'Error deleting post. Please try again.';
    res.redirect(`/posts/${req.params.id}`);
  }
});

module.exports = router;

