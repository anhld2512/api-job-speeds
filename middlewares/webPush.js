const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'BN3yNCATt4zRMU-e5nFIjwMfJ5Gfp3fub6_DcDzphhFu3jbUh2J0QveqBeEVShj5D7afzAHehWx1RQsF9pDjaMU',
  privateKey: '_V7KijvmcMGvXFCuaIoWLUv3-yO_zx1QAc578B7HX_Y'
};

webPush.setVapidDetails(
  'mailto:anh.leduc2512@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const subscriptions = [];

const saveSubscription = (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
};

const sendNotification = (req, res) => {
  const notificationPayload = req.body;

  const promises = subscriptions.map(subscription => {
    return webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  });

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Notification sent successfully.' }));
};

module.exports = {
  saveSubscription,
  sendNotification
};