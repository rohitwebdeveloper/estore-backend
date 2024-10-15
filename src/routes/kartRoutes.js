const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const {userKart, addKart, removeKart} = require('../controllers/kartController')

// Get all kart item of user
router.get('/:userid', asyncHandler(userKart))

// Add product to kart
router.post('/:userid', asyncHandler(addKart))

// Remove kart item 
router.delete('/:productid', asyncHandler(removeKart))


module.exports = router;
