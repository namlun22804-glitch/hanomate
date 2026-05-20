const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Không có quyền truy cập (Missing token)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hanomate_secret_key_2026');
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = { protect };
