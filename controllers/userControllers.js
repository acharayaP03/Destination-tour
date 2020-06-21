const User = require('./../models/userModel')
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');


exports.getAllUsers = catchAsync( async (req, res)=>{
    const users = await User.find()
     //send the response..
     res.status(200).json({
         status : 'success',
         requestedAt : req.requestTime,
         results : users.length,
         data : {
             users
         }
     })
});

exports.getUser = (req, res)=>{
    res.status(500).json({
        status : 'Error',
        message : 'This Route is not defined yet....'
    })
}
exports.createUser = (req, res)=>{
    res.status(500).json({
        status : 'Error',
        message : 'This Route is not defined yet....'
    })
}
exports.updateUser = (req, res)=>{
    res.status(500).json({
        status : 'Error',
        message : 'This Route is not defined yet....'
    })
}
exports.deleteUser = (req, res)=>{
    res.status(500).json({
        status : 'Error',
        message : 'This Route is not defined yet....'
    })
}