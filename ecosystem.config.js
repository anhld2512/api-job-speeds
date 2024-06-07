module.exports = {
    apps: [
      {
        name: 'api-job-speed',
        script: './server.js', // Đường dẫn đến tệp server.js của bạn
        exec_mode: 'fork',
        instances: '1',
        env: {
          NODE_ENV: 'production',
          PORT: 2024,
          MONGO_URI: 'mongodb://uh9ej0bvzeta6m9lehdz:FZGwSnVmi3TRiI7w01f1@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bgrkjtlqyuwttdk?replicaSet=rs0',
          JWT_SECRET: 'yourjwtsecret-sone-team-project-job-tool',
          JWT_REFRESH_SECRET: 'yourjwtsecret-refresh-sone-team-project-job-tool',
          EMAIL_USER: 'your_email@example.com',
          EMAIL_PASS: 'your_email_password',
          SESSION_SECRET: 'your_session_secret'
        }
      }
    ]
  }