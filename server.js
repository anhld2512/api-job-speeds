const express = require('express');
const connectDB = require('./config/db');
const configureExpress = require('./config/expressConfig');
const configureRoute = require('./src/index');

const app = express();
// Connect to MongoDB
connectDB();
// Configure Express
configureExpress(app);
// Configure Route
configureRoute(app)
require('dotenv').config();

const PORT = process.env.PORT || 2024;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});