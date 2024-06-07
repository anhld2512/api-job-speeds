const express = require('express');
const router = express.Router();
const { saveSubscription, sendNotification } = require('../middlewares/webPush');

router.post('/save-subscription', saveSubscription);
router.post('/send-notification', sendNotification);

module.exports = router;