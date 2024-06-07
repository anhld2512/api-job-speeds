const express = require('express');
const { shortenLink } = require('../controllers/linkController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/shorten', authMiddleware, shortenLink);

module.exports = router;