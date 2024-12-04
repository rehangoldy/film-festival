const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('Invalid authorization format');
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authorization format'
    });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return res.status(500).json({
      status: 'error',
      message: 'Server configuration error'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    console.log('Checking admin role for user:', req.user);
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Require Admin Role'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
