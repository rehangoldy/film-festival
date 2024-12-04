const { User } = require('../models');
const { generateToken } = require('../config/jwt.config');
const ResponseUtil = require('../utils/response.util');
const ValidatorUtil = require('../utils/validator.util');

class AuthController {
  static async register(req, res) {
    try {
      const validation = ValidatorUtil.validateUser(req.body);
      if (!validation.isValid) {
        return ResponseUtil.validationError(res, validation.errors);
      }

      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser) {
        return ResponseUtil.validationError(res, { email: 'Email already exists' });
      }

      const user = await User.create(req.body);
      const token = generateToken(user);

      return ResponseUtil.success(res, { user, token }, 'User registered successfully', 201);
    } catch (error) {
      console.error('Registration error:', error);
      return ResponseUtil.error(res, 'Registration failed');
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ResponseUtil.validationError(res, {
          message: 'Email and password are required'
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return ResponseUtil.unauthorized(res, 'Invalid credentials');
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return ResponseUtil.unauthorized(res, 'Invalid credentials');
      }

      const token = generateToken(user);
      return ResponseUtil.success(res, { user, token }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      return ResponseUtil.error(res, 'Login failed');
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return ResponseUtil.notFound(res, 'User not found');
      }

      return ResponseUtil.success(res, { user });
    } catch (error) {
      console.error('Get profile error:', error);
      return ResponseUtil.error(res, 'Failed to get profile');
    }
  }

  static validateToken = async (req, res) => {
    try {
      res.json({
        valid: true,
        user: req.user 
      });
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({
        valid: false,
        message: 'Token tidak valid'
      });
    }
  }
}

module.exports = AuthController;
