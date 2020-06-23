const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

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
    const currentUser = await User.findById(decode.id)
    if(!currentUser){
        return next( new AppError('The user doesnot exit.', 401))
    }
    // 4) Check if user has changed the password after token has been sent or issued.
    
    if (currentUser.changedPasswordAfter(decode.iat)) {
        return next(
          new AppError('User recently changed password! Please log in again.', 401)
        );
      }
    
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

//RESTRICTING ACCESS ACCORDING TO THE LEVEL
exports.restrictTo = (...roles) =>{
    return (req, res, next) =>{
        //check if the req.user from above has roles such as [ 'admin' , 'lead-guide']
        if(!roles.includes(req.user.role)){
            return next( new AppError('You do not have permission to perform this action.', 401));
        }

        //if req.user.role has [admin or lead-guide ] then proceed to next() and perform action

        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) =>{

    //1) Get user based on Posted email.
    //at this poit we dont have user id, hence why we need to use findOne method.
    const user = await User.findOne({email: req.body.email})
    //if email doesnt exist then throw error 
    if(!user){
        return next(new AppError('There is no user with that email', 404))
    }

    // 2) Generate the Random reset token.
    const resetToken = user.createPasswordResetToken();
    //validateBeforeSave has to be set to false or else, we will get validation error from mongoose. becasue at resetToken we only modified the document, but while saving it we actually need to pass
    // validateBeforeSave option and set it to false inorder to save it. 
    // validateBeforeSave deactivates all the mongoose validator in userSchema. 
    await user.save({ validateBeforeSave: false})

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;    
      const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    

    // if email sent i failed the catch block is envoked.
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
          });
    
          res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
          });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false})

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
          );
    }

})

exports.resetPassword = (req, res, next) =>{

}