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
        confirmPassword: req.body.confirmPassword
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
    //since password is included, we need to manualy include here with select('+passowrd')
    const user = await User.findOne({ email }).select('+password')
    //calling instance method from user models
   
    if(!user || !(await user.correctPassword( password, user.password))){
        return next(new AppError('Incorrect email or passowrd', 401))
    }

    console.log(user)
    // 3) If everything is ok then send token to the client.

    const token = signToken(user._id )
    res.status(200).json({
        status: 'success',
        token
    })
});