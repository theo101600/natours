const express = require("express");

const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

console.log(process.env.NODE_ENV);

// Global Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Placing the code below the other route definition because that means the request did not hit the above routes
// .all() means all the http method (get, post, put...)
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// by specifying four arguments, express automatically recognizes it as an error handling middleware
app.use(globalErrorHandler);

module.exports = app;
