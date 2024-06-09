const webPush = require('web-push');
// ======> Open Terminal or CMD : npx web-push generate-vapid-keys
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
  const { title, message, url } = req.body;

  const payload = JSON.stringify({
    title: title || 'Default Title',
    message: message || 'Default message body',
    url: url || 'https://jobspeeds.com/job'
  });

  const options = {
    TTL: 60
  };

  const sendNotificationPromises = subscriptions.map(subscription => {
    return webPush.sendNotification(subscription, payload, options)
      .then(response => {
        console.log('Sent notification', response);
      })
      .catch(error => {
        console.error('Error sending notification', error);
      });
  });

  Promise.all(sendNotificationPromises)
    .then(() => res.status(200).json({ message: 'Notifications sent' }))
    .catch(error => res.status(500).json({ error: error.message }));
};

module.exports = {
  saveSubscription,
  sendNotification
};