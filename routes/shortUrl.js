const express = require('express');
const ShortUrl = require('../models/ShortUrl');
const router = express.Router();

// POST /api/url/shorten - Create short URL
router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json('Original URL is required');
    }
    const shortUrl = new ShortUrl({ originalUrl });
    await shortUrl.save();
    res.json({
        originalUrl: shortUrl.originalUrl,
        shortUrlId: shortUrl.shortUrlId,
        shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl.shortUrlId}`
    });
});

module.exports = router;
