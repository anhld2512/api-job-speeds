const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        if (ex.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'jwt expired' });
        } else {
            console.log(ex);
            return res.status(401).json({ error: 'Invalid token. Error in Login' });
        }
    }
};

module.exports = authMiddleware;