const jwt = require('jsonwebtoken');
const {findSellerProfile, updateSellerProfile} = require('../services/sellerService')
const {getsellerProduct} = require('../services/productService')
const {getSellerOrder} = require('../services/orderService')



// Controller for seller profile
const sellerProfile = async (req, res) => {

    const sellerToken = req.params.userid;
    const decoded = await jwt.verify(sellerToken, process.env.JWT_SECRET)
    const sellerDetails = await findSellerProfile(decoded.useremail)
    return res.status(200).json(sellerDetails)
}


// Controller for seller products
const sellersProducts = async (req, res) => {

    const sellerToken = req.params.userid;
    const decoded = await jwt.verify(sellerToken, process.env.JWT_SECRET)
    const sellerProduct = await getsellerProduct(decoded.sellerId)
    return res.status(200).json(sellerProduct)
}



// Controller for seller orders
const sellersOrders = async (req, res) => {

    const sellerId = req.params.sellerid;
    const decoded = await jwt.verify(sellerId, process.env.JWT_SECRET)
    const sellerOrder = await getSellerOrder(decoded.sellerId)
    return res.status(200).json(sellerOrder)
}


// Controller for seller profile update
const sellerProfileUpdate = async (req, res) => {
    const { name, email, company, mobileno, locality, city, state, pincode } = req.body;

        const updateResult = await updateSellerProfile(email, name, company, mobileno, locality, city, state, pincode)
        if (updateResult) {
            return res.status(200).json({ success: true, message: 'Seller Profile Updated Successfully', updateResult })
        } else {
            return res.status(403).json({ success: false, message: 'Sorry, Unable to Update Profile', updateResult })
        }
}



module.exports = {
    sellerProfile,
    sellersProducts,
    sellersOrders,
    sellerProfileUpdate,
    
}