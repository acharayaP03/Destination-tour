const express = require('express');
const morgan = require('morgan');//dev logger middleware
const rateLimit = require('express-rate-limit');// api request limiter middleware
const helmet = require('helmet');// header middleware.
const mongoSanitize = require('express-mongo-sanitize') // NoSQL injection attack midleware.
const xssClean = require('xss-clean') //XSS middleware
const hpp = require('hpp')// params pollution middleware
// eslint-disable-next-line prettier/prettier

const AppError = require('./utils/appError');
const appErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES....

// Header middleware
// set header before anything else.
app.use(helmet())

// dev logger middleware
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// rate limiter.. midleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "You have passed request limit, please try again in an hour."
});

app.use("/api", limiter)

//express json/bodyparser middleware to for json reply/ reading data from body into req.body

app.use(express.json({ limit : '10kb'}));// limiting file size while serving application.

//data sanitization against NoSQL query injection
app.use(mongoSanitize())
//data sanitization against XSS
app.use(xssClean())
//prevent params pollution. only whitelist those params that are defiened 
app.use(hpp( {
  whitelist: ['duration', 'ratingAverage', 'maxGroupSize', 'difficulty', 'price', 'ratingsQuantity']
}))
//Public path to access assets such as images css and others/ static file middleware
app.use(express.static(`${__dirname}/public`));


// test middle ware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
  next();
});

app.get('/', (req, res, next) => {
  res.send('Hello from index page....');
  res.end();
});

//Introducing router middleware for more modularity... and mounting them.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


//Introducing Error handler middleware.
app.all('*', (req, res, next) =>{

  //this error will be handled from the error controller..
  next(new AppError(`Cannot get ${req.originalUrl} on this server..`, 404))
})
app.use(appErrorHandler)

module.exports = app;
