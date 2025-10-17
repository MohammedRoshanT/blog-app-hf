const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.error = 'Please log in to access this page.';
  res.redirect('/login');
};

// Middleware to check if user is not authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

// Homepage - Display all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(10); // Limit to 10 most recent posts for homepage
    
    res.render('home', { 
      posts,
      title: 'Blog Home'
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    req.session.error = 'Error loading posts. Please try again.';
    res.redirect('/');
  }
});

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login', { 
    title: 'Login',
    error: req.session.error || ''
  });
});

// Login POST route
router.post('/login', isNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      req.session.error = 'An error occurred during login.';
      return res.redirect('/login');
    }
    if (!user) {
      req.session.error = info.message;
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        req.session.error = 'An error occurred during login.';
        return res.redirect('/login');
      }
      req.session.success = `Welcome back, ${user.username}!`;
      return res.redirect('/');
    });
  })(req, res, next);
});

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register', { 
    title: 'Register',
    error: req.session.error || ''
  });
});

// Register POST route
router.post('/register', isNotAuthenticated, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      req.session.error = 'All fields are required.';
      return res.redirect('/register');
    }
    
    if (password !== confirmPassword) {
      req.session.error = 'Passwords do not match.';
      return res.redirect('/register');
    }
    
    if (password.length < 6) {
      req.session.error = 'Password must be at least 6 characters long.';
      return res.redirect('/register');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });
    
    if (existingUser) {
      req.session.error = 'Username or email already exists.';
      return res.redirect('/register');
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    req.session.success = 'Registration successful! Please log in.';
    res.redirect('/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.session.error = messages.join(', ');
    } else {
      req.session.error = 'Registration failed. Please try again.';
    }
    res.redirect('/register');
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      req.session.error = 'Error during logout.';
      return res.redirect('/');
    }
    req.session.success = 'You have been logged out successfully.';
    res.redirect('/');
  });
});

// Profile page (protected)
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    
    res.render('profile', {
      user: req.user,
      posts: userPosts,
      title: 'My Profile'
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    req.session.error = 'Error loading profile.';
    res.redirect('/');
  }
});

module.exports = router;

