const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'BA5xnicrkH0hO5H0Y3cK5AAik0G_j62c8mukA0eYjhQ9ShDxDvh9gksXEL-VRMoZaeT2bDh2y_1Wi2C3ro9d_9E',
  privateKey: 'rDJFQnxX2BgHuC_H_zlFTk_QpDQyOzP1eON4xu7ucP4'
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