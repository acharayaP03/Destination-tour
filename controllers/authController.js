const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

const signToken = id =>{
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async(req, res) =>{
    //varifying user whilst loging in...
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt
    });

    //creating json web token
    const token = signToken(newUser._id )

    res.status(201).json({
        status: 'success',
        token, 
        data: {
            user: newUser
        }
    })
});

//Login in user  with their credentials..

exports.login =catchAsync(async (req, res, next) =>{

    //since req.body holds all user's details.. we can extract email and password from their.
    const { email, password } = req.body;

    // 1) Check if user exists && password is correct.
    if(!email || !password) {
        return next ( new AppError('Please provide email and password', 400))
    }

    // 2) Check if user exists && passowrd is correct
    //since password is excluded, we need to manualy include here with select('+passowrd')
    const user = await User.findOne({ email }).select('+password')
    //calling instance method from user models
   
    if(!user || !(await user.correctPassword( password, user.password))){
        return next(new AppError('Incorrect email or passowrd', 401))
    }

    //console.log(user)
    // 3) If everything is ok then send token to the client.

    const token = signToken(user._id )
    res.status(200).json({
        status: 'success',
        token
    })
});

exports.protectedRoutes = catchAsync(async (req, res, next ) =>{

    let  token;
    // 1) Getting token and check if it's there 
  
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       
        token = req.headers.authorization.split(' ')[1]
       
    }
   
    if(!token){
        return next( new AppError('Unauthorize access, please log in before your access this page.', 401))
    }
    // 2) validate the token that was received.
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //console.log(decode)
    // 3) If successfull check if user still exists.
    const freshUser = await User.findById(decode.id)
    if(!freshUser){
        return next( new AppError('The user doesnot exit.', 401))
    }
    // 4) Check if user has changed the password after token has been sent or issued.
    
    if (freshUser.changedPasswordAfter(decode.iat)) {
        return next(
          new AppError('User recently changed password! Please log in again.', 401)
        );
      }
    
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
})