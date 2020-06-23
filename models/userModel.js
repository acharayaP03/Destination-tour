const mongoose = require('mongoose');
const validator = require('validator');

//passowrd hashing
const bcrypt = require('bcryptjs');

//CREATE SCHEMA FOR USER MODEL..
//create username, email, photo, password, confirmPassowrd fields. 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name.'],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please include your email.'],
        validate: [validator.isEmail, 'Please provide valid email.']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your passowrd.'],
        validate : {
            //Only works on SAVE AND CREATE.
            validator: function(el){
                //if the confirmPassword is not equal to password then , this fucntion wil return false on save. 
                return el === this.password
            },
            message: "Confirm password does not match password."
        }
    },
    passwordChangedAt: Date
});

//Mongoose middleware presave inorder to salt passowrd or encrypt password when saving to the database. 

userSchema.pre('save', async function(next) {
    //only run this fucntion if password is already modified.
    if(!this.isModified('password')) return next(); 
    //if not then modify it with hash with the cost of 12.
    this.password = await bcrypt.hash(this.password, 12);

    //we dont need to save confirm password, hence we are deleting it by setting it to undefined. 
    this.confirmPassword = undefined

    next()
})

//decrypt password by instance method.
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

//instance method for user change password.
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt( this.passwordChangedAt.getTime() / 1000, 10);
        
        // if the token issued is less then return true. and password has been changed.
        return JWTTimestamp < changedTimestamp;

      }
    
      // False means NOT changed
      return false;
}
const User = mongoose.model('User', userSchema)

module.exports = User;