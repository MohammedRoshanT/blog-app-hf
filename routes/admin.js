const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  req.session.error = 'Please log in to access this page.';
  return res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  req.session.error = 'Admin access required.';
  return res.redirect('/');
};

// Admin dashboard
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [usersCount, postsCount, commentsCount, latestPosts, latestUsers] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Post.find().sort({ createdAt: -1 }).limit(5).populate('author', 'username'),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      usersCount,
      postsCount,
      commentsCount,
      latestPosts,
      latestUsers
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    req.session.error = 'Failed to load dashboard.';
    res.redirect('/');
  }
});

// Manage users
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { title: 'Manage Users', users });
  } catch (error) {
    console.error('Error loading users:', error);
    req.session.error = 'Failed to load users.';
    res.redirect('/admin');
  }
});

router.post('/users/:id/role', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      req.session.error = 'Invalid role value.';
      return res.redirect('/admin/users');
    }
    await User.findByIdAndUpdate(req.params.id, { role });
    req.session.success = 'User role updated.';
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error updating user role:', error);
    req.session.error = 'Failed to update user role.';
    res.redirect('/admin/users');
  }
});

router.post('/users/:id/delete', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId });
    const postIds = posts.map(p => p._id);

    await Promise.all([
      Comment.deleteMany({ author: userId }),
      Comment.deleteMany({ post: { $in: postIds } }),
      Post.deleteMany({ author: userId }),
      User.findByIdAndDelete(userId)
    ]);

    req.session.success = 'User and related content deleted.';
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.session.error = 'Failed to delete user.';
    res.redirect('/admin/users');
  }
});

// Manage posts
router.get('/posts', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username');
    res.render('admin/posts', { title: 'Manage Posts', posts });
  } catch (error) {
    console.error('Error loading posts:', error);
    req.session.error = 'Failed to load posts.';
    res.redirect('/admin');
  }
});

router.post('/posts/:id/delete', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    req.session.success = 'Post deleted.';
    res.redirect('/admin/posts');
  } catch (error) {
    console.error('Error deleting post:', error);
    req.session.error = 'Failed to delete post.';
    res.redirect('/admin/posts');
  }
});

module.exports = router;


