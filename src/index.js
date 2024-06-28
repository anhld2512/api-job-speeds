const ShortUrl = require('../models/ShortUrl');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const fileRoutes = require('../routes/fileRoutes');
const profileRoutes = require('../routes/profileRoutes');
const jobRoutes = require('../routes/jobRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const applyRoutes = require('../routes/applyRoutes');
const shortUrl = require('../routes/shortUrl')
// const emailRoutes = require('./routes/emailRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');
// const linkRoutes = require('./routes/linkRoutes');
// const applicationFormRoutes = require('./routes/applicationFormRoutes');
// const postRoutes = require('./routes/postRoutes');
// const albumRoutes = require('./routes/albumRoutes');
// const publicShareCvRoutes = require('./routes/publicShareCvRoutes');

const configureRoute = (app) =>{
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/files', fileRoutes);
    app.use('/api/profiles', profileRoutes);
    app.use('/api/jobs', jobRoutes);
    app.use('/api/notifications', notificationRoutes)
    app.use('/api/applications', applyRoutes);
    app.use('/api/url', shortUrl);
    app.get('/:shortUrlId', async (req, res) => {
        const shortUrl = await ShortUrl.findOne({ shortUrlId: req.params.shortUrlId });
        if (shortUrl) {
            res.redirect(shortUrl.originalUrl);
        } else {
            res.status(404).json('URL not found');
        }
      });
    // app.use('/api/links', linkRoutes);
    // app.use('/api/emails', emailRoutes);
    // app.use('/api/employees', employeeRoutes);
    // app.use('/api/applicationForms', applicationFormRoutes);
    // app.use('/api/posts', postRoutes);
    // app.use('/api/albums', albumRoutes);
    // app.use('/api/publicShareCvs', publicShareCvRoutes);
}
module.exports = configureRoute;