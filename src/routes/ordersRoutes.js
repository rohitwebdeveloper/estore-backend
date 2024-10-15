const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const { orderStatus, orderUser, orderId, orderPlace} = require('../controllers/orderController') 

// Get all user orders
router.get('/:userid', asyncHandler(orderUser))

// Generate order id 
router.post('/generate-id', asyncHandler(orderId))

// Place order
router.post('/place-order', asyncHandler(orderPlace))

// Update status
router.patch('/status', asyncHandler(orderStatus))



module.exports = router;





