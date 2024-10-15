const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const {userProfile, userProfileUpdate} = require('../controllers/userController')


// Get user profile
router.get('/profile/:userid', asyncHandler(userProfile))

// Update user profile
router.patch('/profile', asyncHandler(userProfileUpdate))




module.exports = router;