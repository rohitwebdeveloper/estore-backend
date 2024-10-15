const jwt = require('jsonwebtoken');
const { getUserWishlist, addToWishlist, removeWishlistProduct} = require('../services/wishlistService')


// Conroller for user wishlist
const wishlistUser = async (req, res) => {

    const usertoken = req.params.userid
    const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET)
    const userWishlist = await getUserWishlist(decoded.userId)
    return res.status(200).json(userWishlist)
}


// Controller to remove wishlist item
const wishlistRemove = async (req, res) => {

    const { productid } = req.params;
    const result = await removeWishlistProduct(productid)
    if (result) {
        return res.status(200).json({ success: true, message: 'Product Removed Successfully' })
    }
}



// Controller to add item
const wishlistAdd = async (req, res) => {

    const productId = req.params.productid;
    const userId = req.body.userid;
    const decoded = await jwt.verify(userId, process.env.JWT_SECRET)
    await addToWishlist(decoded.userId, productId)
    res.status(200).json({ success: true, message: 'Added To Wishlist' })
}




module.exports = {
    wishlistUser,
    wishlistRemove,
    wishlistAdd,
}