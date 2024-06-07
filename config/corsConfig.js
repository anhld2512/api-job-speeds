const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://jobspeeds.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = cors(corsOptions);