const User = require('./../models/userModel')
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');


//filtered body,
const filterObj = (obj, ...allowedFields) =>{
    const newObj = {};
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj;
}

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

//Updting current user data.
exports.updateUserData = catchAsync( async (req, res, next) =>{

    // 1) Create Error if user posts passowrd data, dont allow user to updata their password in this route.
    if(req.body.password || req.body.confirmPassword){
        return next( new AppError('Changing passowrd is not allowed here, please use update my link.', 400))
    }
    // 3) Upadate user document -- filtering fields that are not allowed such as role.
    //since we cannot allow use to change anything but name and email fields , we need to filter out the role from req.body.
    const filteredBody = filterObj(req.body, "name", "email");
    // Here we actually need to user moongoose filterByIdAndUpade method because .save() will run confirmPassword validator and password route is not allowed in updateuserdata route.
    // filterByIdAndUpade will not run validator. 
     // 3) Upadate user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true})

    res.status(200).json({
        status : 'success',
        data: {
            user: updatedUser
        }
    })
});

//we dont allow users to delete their account but simply deactivate their account just incase if they want to reactivate.
//inorder to acheive this, we added a field in our userModel schema called active.
exports.deleteUserData = catchAsync( async (req, res, next) =>{
    //since user is already logged in, we can get thier id from req.body.id 
    await User.findByIdAndUpdate(req.user.id, { active: false})

    res.status(204).json({
        status: 'success',
        data: null
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