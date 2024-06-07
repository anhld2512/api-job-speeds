const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const configureExpress = require('./config/expressConfig');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// const emailRoutes = require('./routes/emailRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');
// const applyRoutes = require('./routes/applyRoutes');
// const linkRoutes = require('./routes/linkRoutes');

// const applicationFormRoutes = require('./routes/applicationFormRoutes');
// const postRoutes = require('./routes/postRoutes');
// const albumRoutes = require('./routes/albumRoutes');
// const publicShareCvRoutes = require('./routes/publicShareCvRoutes');

const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

// Configure Express
configureExpress(app);
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes)

// app.use('/api/links', linkRoutes);
// app.use('/api/emails', emailRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/applicationForms', applicationFormRoutes);
// app.use('/api/apply', applyRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/albums', albumRoutes);
// app.use('/api/publicShareCvs', publicShareCvRoutes);
;
app.use(errorHandler);

const PORT = process.env.PORT || 2024;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});