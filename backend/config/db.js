const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ không cần các option cũ nữa
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed (it is okay to run without it for AI demo): ${error.message}`);
    // process.exit(1);
  }
};

module.exports = connectDB;
