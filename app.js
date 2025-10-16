const express = require("express");

const app = express();
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Placing the code below the other route definition because that means the request did not hit the above routes
// .all() means all the http method (get, post, put...)
app.all("*", (req, res, next) => {
  //Creating an error
  const err = new Error(`Cannot find ${req.originalUrl} on this server.`);
  err.status = "fail";
  err.statusCode = 404;

  // if the next() receives an argument, it automatically knows that an error occured
  next(err);
});

// by specifying four arguments, express automatically recognizes it as an error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
