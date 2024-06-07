const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  
    res.status(201).json({ token, refreshToken, userId: user._id });
  };
  
  exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  
    res.json({ token, refreshToken, userId: user._id });
  };
  exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // 15 minutes
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }
};