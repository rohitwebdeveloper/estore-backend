const { wishlist } = require('../models/wishlist')
const mongoose = require('mongoose')

// User wishlist item
const getUserWishlist = async (userId) => {

    const wishlistItem = await wishlist.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails',
            }
        },
        {
            $addFields: {
                productdetail: {
                    $arrayElemAt: ['$productDetails', 0]
                }
            }
        },
    ])
    return wishlistItem
}


// Add item to wishlist
const addToWishlist = async (userId, productId) => {
    const wishlistItem = new wishlist({
        user: userId,
        product: productId
    })
    await wishlistItem.save()
    return
}


// Remove wishlist item
const removeWishlistProduct = async (productid) => {
    await wishlist.deleteOne({ _id: productid })
    return true;
}


module.exports = {
    getUserWishlist,
    addToWishlist,
    removeWishlistProduct
}