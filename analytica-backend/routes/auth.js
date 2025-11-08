import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  // 1. Get username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // 2. Check if the user already exists (by email or username)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    // 3. If new user, create a new User instance
    user = new User({
      username,
      email,
      password,
    });

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Save the new user to the database
    await user.save();

    // 6. Create a JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id, // This 'id' comes from mongoose
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // We need to add this to .env
      { expiresIn: '30d' }, // Token expires in 30 days
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Log In)
// @access  Public
router.post('/login', async (req, res) => {
  // 1. Get email and password from the request body
  const { email, password } = req.body;

  try {
    // 2. Check if the user exists (by email)
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    // Note: We use "Invalid credentials" for both errors to prevent attackers
    // from knowing which one (email or password) was wrong.

    // 4. If password matches, create and send a JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


export default router;