const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateUserData, deleteUserData } = require('./../controllers/userControllers');
const { signup, login, forgotPassword, resetPassword, protectedRoutes, updatePassword } = require('./../controllers/authController');
const router = express.Router();


router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotpassword', forgotPassword)
router.patch('/resetpassword/:token', resetPassword)
//updates the user password
router.patch('/updatepassword', protectedRoutes, updatePassword);
//updates the user details
router.patch('/updateuserdata', protectedRoutes, updateUserData)
//deactivates the users rather than deleting thier accout from db
router.delete('/deleteuserdata', protectedRoutes, deleteUserData)
router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch( updateUser)
    .delete( deleteUser)


module.exports = router