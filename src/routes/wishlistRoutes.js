const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const { wishlistUser, wishlistRemove, wishlistAdd,} = require('../controllers/wishlistController')

// Get all Wishlist item of user
router.get('/:userid', asyncHandler(wishlistUser))

// Add product to Wishlist
router.post('/:productid', asyncHandler(wishlistAdd))

// Remove Wishlist item 
router.delete('/:productid', asyncHandler(wishlistRemove))


module.exports = router