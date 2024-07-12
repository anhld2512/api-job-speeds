const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB đã kết nối');
  } catch (error) {
    console.error('Lỗi khi kết nối đến MongoDB:', error.message);
    process.exit(1);
  }
};

mongoose.set('debug', true);

module.exports = connectDB;
