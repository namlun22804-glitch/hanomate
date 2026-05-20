const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hanomate_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server', detail: error.message });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server', detail: error.message });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server', detail: error.message });
  }
};

// @desc    Mock Social Login (Vì chưa có API Keys thật)
// @route   POST /api/auth/social
// @access  Public
const socialAuth = async (req, res) => {
  try {
    const { provider, email, name, socialId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Tạo user mới nếu chưa tồn tại
      user = await User.create({
        name,
        email,
        provider,
        socialId,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1A56DB&color=fff`,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng nhập mạng xã hội', detail: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  socialAuth,
};
