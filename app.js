const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1) MIDDLEWARES
// Only running this morgan middleware(logging) when we are in development
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
