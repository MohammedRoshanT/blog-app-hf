# Node.js Blog Application

A complete blog application built with Node.js, Express.js, MongoDB, and modern web technologies. Features full CRUD functionality for blog posts, user authentication, comments system, and a responsive design.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Blog Post Management**: Create, read, update, and delete blog posts
- **Comments System**: Users can comment on posts
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Session Management**: Persistent user sessions
- **Password Security**: Bcrypt hashing for secure password storage

### User Features
- User registration and login
- Create and manage personal blog posts
- Comment on any blog post
- Edit and delete own posts and comments
- User profile page with post statistics

### Technical Features
- RESTful API design
- MongoDB with Mongoose ODM
- EJS templating engine
- Passport.js authentication
- Express session management
- Method override for PUT/DELETE requests
- Input validation and error handling

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local Strategy)
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS (CDN)
- **Session Store**: connect-mongo
- **Password Hashing**: bcryptjs
- **Form Handling**: method-override

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
# If you have git installed
git clone <repository-url>
cd node-blog-app

# Or download and extract the project files
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required dependencies listed in `package.json`.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/blog-app

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Port (optional, defaults to 3000)
PORT=3000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**MongoDB Atlas:**
- Use your MongoDB Atlas connection string in the `MONGODB_URI` variable

### 5. Run the Application

```bash
# Start the application
npm start

# Or for development with auto-restart
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
node-blog-app/
├── models/                 # Mongoose models
│   ├── user.js           # User model
│   ├── post.js           # Post model
│   └── comment.js        # Comment model
├── routes/               # Express routes
│   ├── index.js          # Authentication routes
│   ├── posts.js          # Post CRUD routes
│   └── comments.js       # Comment routes
├── views/                # EJS templates
│   ├── partials/         # Reusable template parts
│   │   ├── header.ejs    # Navigation and head
│   │   └── footer.ejs    # Footer and scripts
│   ├── posts/            # Post-related templates
│   │   ├── index.ejs     # All posts listing
│   │   ├── show.ejs      # Single post view
│   │   ├── new.ejs       # Create post form
│   │   └── edit.ejs      # Edit post form
│   ├── home.ejs          # Homepage
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   ├── profile.ejs       # User profile
│   └── error.ejs         # Error page
├── server.js             # Main application file
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🔧 API Endpoints

### Authentication Routes
- `GET /` - Homepage (all posts)
- `GET /login` - Login page
- `POST /login` - User login
- `GET /register` - Registration page
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /profile` - User profile (protected)

### Post Routes
- `GET /posts` - All posts with pagination
- `GET /posts/new` - Create post form (protected)
- `POST /posts` - Create new post (protected)
- `GET /posts/:id` - View single post
- `GET /posts/:id/edit` - Edit post form (protected, author only)
- `PUT /posts/:id` - Update post (protected, author only)
- `DELETE /posts/:id` - Delete post (protected, author only)

### Comment Routes
- `POST /comments` - Create comment (protected)
- `DELETE /comments/:id` - Delete comment (protected, author only)

## 🎨 Features Overview

### Homepage
- Displays recent blog posts
- Responsive card layout
- Post excerpts and metadata
- Call-to-action for new users

### User Authentication
- Secure password hashing with bcrypt
- Session-based authentication
- Protected routes middleware
- Flash messages for user feedback

### Blog Post Management
- Rich text content support
- Character counting
- Author-only edit/delete permissions
- Responsive forms with validation

### Comments System
- Real-time comment display
- Author-only comment deletion
- Nested comment structure
- User-friendly comment forms

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Consistent color scheme
- Accessible UI components

## 🔒 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- CSRF protection through sessions
- Input validation and sanitization
- Protected routes for sensitive operations
- Author-only permissions for post/comment management

## 🚀 Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app
SESSION_SECRET=your-production-secret-key
PORT=3000
NODE_ENV=production
```

### Deployment Platforms

This application can be deployed on:
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Elastic Beanstalk
- **Vercel**: Serverless deployment
- **Railway**: Simple Node.js deployment

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for MongoDB Atlas

2. **Session Not Persisting**
   - Check `SESSION_SECRET` in `.env`
   - Ensure MongoDB is accessible for session store

3. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill existing process on port 3000

4. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the database
- Tailwind CSS for the styling framework
- Passport.js for authentication
- All open-source contributors

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository
4. Contact the development team

---

**Happy Blogging! 🎉**

#   b l o g - a p p 
 
 #   b l o g - a p p 
 
 
