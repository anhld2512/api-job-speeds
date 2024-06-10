const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB đã kết nối');
  } catch (error) {
    console.error('Lỗi khi kết nối đến MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
