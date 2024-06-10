const express = require('express');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const corsConfig = require('./corsConfig');

const configureExpress = (app) => {
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  });

  // Apply middleware
  app.use(limiter);
  app.use(compression());
  app.use(cookieParser());
  // app.use(corsConfig);

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your_secret_key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
    })
  );

  // Static files caching
  app.use(express.static('public', {
    maxAge: '1d',
    etag: false
  }));
};

module.exports = configureExpress;