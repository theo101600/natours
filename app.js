const express = require("express");

const path = require("path");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");
const { restrictTo } = require("./controllers/authController");

// console.log(process.env.NODE_ENV);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Global Middlewares
// set Security HTTP headers
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set Security HTTP headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: [
        "'self'",
        "blob:",
        "https://cdn.jsdelivr.net",
        "https://js.stripe.com",
        "https://api.mapbox.com",
      ],

      scriptSrcElem: [
        "'self'",
        "blob:",
        "https://js.stripe.com",
        "https://api.mapbox.com",
      ],

      connectSrc: [
        "'self'",
        "http://127.0.0.1:3000",
        "http://localhost:3000",

        // Stripe
        "https://api.stripe.com",
        "https://js.stripe.com",

        // Mapbox
        "https://api.mapbox.com",
        "https://events.mapbox.com",

        // Parcel HMR (development)
        "ws://127.0.0.1:*",
      ],

      frameSrc: ["'self'", "https://js.stripe.com"],

      imgSrc: ["'self'", "data:", "blob:", "https:", "https://*.stripe.com"],

      styleSrc: ["'self'", "https:", "'unsafe-inline'"],

      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    // allow certain parameters to have duplicates
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

// Placing the code below the other route definition because that means the request did not hit the above routes
// .all() means all the http method (get, post, put...)
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// by specifying four arguments, express automatically recognizes it as an error handling middleware
app.use(globalErrorHandler);

module.exports = app;
