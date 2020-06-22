const AppError = require('./../utils/appError');


//MongoDb castError 
const handleCastErrorDb = err =>{
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400)
}

const handleDuplicateFieldDb = err =>{
    //const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    console.log(err.keyValue.name)
    const message = `Field ${err.keyValue.name} already exists. please choose another name`;

    return new AppError(message, 400)
}

const handleValidationErrorDb = err =>{
    const errors = Object.values(err.errors).map( el => el.name.message);

    const message = `Invalid Input data ${errors.join('. ')}`;
    return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

//Token expired error handler

const handleExpiredTokenError = ()  =>{
    return new AppError('Your token has expired, please log in again.', 401)
}

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error : err,
        message: err.message,
        stack : err.stack
    })
}

const sendErrorProd = (err, res) =>{

    //Operational, trusted err: send message to client
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    //Programming or other unknown error: dont leak error details.
    }else{
        console.error('ERROR ', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}
module.exports = (err, req, res, next) =>{
    console.log(err.stack)

    err.status = err.status || 'fail';
    err.statusCode = err.statusCode || 500;
  
    // res.status(err.statusCode).json({
    //   status : err.status,
    //   message: err.message
    // })
   
    if(process.env.NODE_ENV === 'development'){
       
        sendErrorDev(err, res)

    }else if(process.env.NODE_ENV === 'production'){

        let error = { ...err};

        if(error.name === 'CastError') error = handleCastErrorDb(error)
        if (error.code === 11000) error = handleDuplicateFieldDb(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDb(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === "TokenExpiredError") error = handleExpiredTokenError()
        sendErrorProd(error, res)
    }
}