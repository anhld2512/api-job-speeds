const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const configureExpress = require('./config/expressConfig');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const applyRoutes = require('./routes/applyRoutes');


// const emailRoutes = require('./routes/emailRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');

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
app.use('/api/applications', applyRoutes);

// app.use('/api/links', linkRoutes);
// app.use('/api/emails', emailRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/applicationForms', applicationFormRoutes);

// app.use('/api/posts', postRoutes);
// app.use('/api/albums', albumRoutes);
// app.use('/api/publicShareCvs', publicShareCvRoutes);
;
app.use(errorHandler);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:3000', 'https://jobspeeds.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 2024;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});