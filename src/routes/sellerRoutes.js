const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const {sellerProfile, sellersProducts, sellersOrders, sellerProfileUpdate, } = require('../controllers/sellerController')


// Get all products of seller
router.get('/product/:userid', asyncHandler(sellersProducts))

// Get all orders of seller
router.get('/orders/:sellerid', asyncHandler(sellersOrders))

// Get seller profile
router.get('/profile/:userid', asyncHandler(sellerProfile))

// Update seller profile
router.put('/profile', asyncHandler(sellerProfileUpdate))




module.exports = router;