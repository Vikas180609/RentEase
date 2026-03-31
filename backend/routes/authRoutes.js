import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 1. REGISTER A NEW USER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Scramble (hash) the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user to the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully!', userId: user._id });
  } catch (error) {
    console.error('Auth Register Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. LOGIN AN EXISTING USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the typed password with the scrambled one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Give them a "VIP Pass" (Token) so the frontend knows they are logged in
    // Note: We use a fallback secret key here, but in a real app, this goes in your .env file!
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretkey', {
      expiresIn: '30d' // Token expires in 30 days
    });

    res.json({
      message: 'Login successful!',
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Auth Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
