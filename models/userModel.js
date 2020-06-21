const mongoose = require('mongoose');
const validator = require('validator');

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
        validator: [validator.isEmail, 'Please provide valid email.']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your passowrd.']
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User;