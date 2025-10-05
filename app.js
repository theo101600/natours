const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//adding a simple middleware
app.use(express.json());

//1) MIDDLEWARES
app.use(morgan('dev'));

//use((<request>, <response>, <next>) => {})
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//reading the contents of the tours-simple.json file

//2) ROUTE HANDLERS

//3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4) START SERVER
//.listen(<port>, <callback function>)
module.exports = app;
