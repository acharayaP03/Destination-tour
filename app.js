const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line prettier/prettier

const AppError = require('./utils/appError');
const appErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//middle ware...
// console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//express json middleware to for json reply..
app.use(express.json());

//Public path to access assets such as images css and others..
app.use(express.static(`${__dirname}/public`));


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

// for all http verbs, if there is invalid request.
/*
An Example of very simple error handler..
app.all('*', (req, res, next) =>{
  // res.status(404).json({
  //   status: 'fai',
  //   message: `Cannot get ${req.originalUrl} on this server..`
  // })

  const err = new Error( `Cannot get ${req.originalUrl} on this server..`)
  err.status = 'fail',
  err.statusCode = 404

  next(err)
})

app.use((err, req, res, next) =>{
  err.status = err.status || 'fail';
  errstatusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status : err.status,
    message: err.message
  })
})
*/

//Introducing Error handler middleware.
app.all('*', (req, res, next) =>{

  //this error will be handled from the error controller..
  next(new AppError(`Cannot get ${req.originalUrl} on this server..`, 404))
})
app.use(appErrorHandler)

module.exports = app;
