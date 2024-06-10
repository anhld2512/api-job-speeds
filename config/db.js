const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10000, // Tối đa 10 kết nối đồng thời
      serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây
      socketTimeoutMS: 45000, // Timeout socket sau 45 giây
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log('MongoDB đã kết nối');
  } catch (error) {
    console.error('Lỗi khi kết nối đến MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
