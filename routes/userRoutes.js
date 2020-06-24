const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('./../controllers/userControllers');
const { signup, login, forgotPassword, resetPassword, protectedRoutes, updatePassword } = require('./../controllers/authController');
const router = express.Router();


router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotpassword', forgotPassword)
router.patch('/resetpassword/:token', resetPassword)
router.patch('/updatepassword', protectedRoutes, updatePassword)
router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch( updateUser)
    .delete( deleteUser)


module.exports = router