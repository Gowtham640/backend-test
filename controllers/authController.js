const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User created', token: generateToken(user._id) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await user.comparePassword(password)) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', token: generateToken(user._id) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
