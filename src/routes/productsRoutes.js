const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const store = require('../middlewares/storeimage')
const { productByCategory, singleProduct, searchProduct, saveProductRating, productPublish, productUnpublish, } = require('../controllers/productController')


// Get product by id 
router.get('/details/:productid', asyncHandler(singleProduct))

// Get product by search
router.get('/search', asyncHandler(searchProduct))

// Publish a new product
router.post('/', store.single('photo'), asyncHandler(productPublish))

//Unpublish existing product
router.delete('/:productid', asyncHandler(productUnpublish))

// Get product by category
router.get('/category/:category', asyncHandler(productByCategory))

// Add rating to a product
router.post('/rating', asyncHandler(saveProductRating))


module.exports = router;