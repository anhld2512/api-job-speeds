const express = require("express");
const session = require('express-session');
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const corsConfig = require("./corsConfig");
const bodyParser = require("body-parser");
const errorHandler = require("../middlewares/errorHandler");
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();
const configureExpress = (app) => {
  app.use(express.json());

  app.use(errorHandler);
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
  });
  app.use(limiter);
  app.use(compression());
  app.use(cookieParser());
  // app.use(corsConfig);

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your_secret_key",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: process.env.NODE_ENV === "production" }, // Use secure cookies in production
    })
  );

  // Static files caching
  app.use(
    express.static("public", {
      maxAge: "1d",
      etag: false,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  // Serve static files from the public and private directories
  app.use(
    "/uploads/public",
    express.static(path.join(__dirname, "uploads/public"))
  );
  app.use(
    "/uploads/private",
    express.static(path.join(__dirname, "uploads/private"))
  );

  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
  );
};

module.exports = configureExpress;
