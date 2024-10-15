const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const {signInUser, signUpUser, verifyUser, googleSignInUser, forgetPassword, passwordReset, sellerRegister } = require('../controllers/authController')


// Register new user
router.post('/signup', asyncHandler(signUpUser))

// Log in user
router.post('/signin', asyncHandler(signInUser))

//Verify current user
router.post('/verify', asyncHandler(verifyUser))

// Log in user with google
router.post('/google/signin', asyncHandler(googleSignInUser))

// request for password reset
router.post('/forgot-password', asyncHandler(forgetPassword))

// reset new password 
router.patch('/reset-password', asyncHandler(passwordReset))

// Register new seller
router.post('/register-seller', asyncHandler(sellerRegister))




module.exports = router;