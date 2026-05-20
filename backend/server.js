const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load biến môi trường
dotenv.config();

// Kết nối Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'HanoMate API đang chạy 🚀' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});
