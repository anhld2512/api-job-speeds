const { GridFsStorage } = require('multer-gridfs-storage');
const dotenv = require('dotenv');
dotenv.config();

const storage = new GridFsStorage({
    url: 'mongodb://uh9ej0bvzeta6m9lehdz:FZGwSnVmi3TRiI7w01f1@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bgrkjtlqyuwttdk?replicaSet=rs0',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: `${Date.now()}-jobspeeds-${file.originalname}`,
            bucketName: 'uploads',
        };
    },
});

storage.on('connection', (db) => {
    // Database connected
    console.log('Connected to MongoDB for file storage');
});

storage.on('error', (err) => {
    console.error('Failed to connect to MongoDB for file storage:', err);
});

module.exports = storage;