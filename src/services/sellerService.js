const { seller } = require('../models/seller')
const { user } = require('../models/user')
const mongoose = require('mongoose')


//Find seller
const findSellerExistance = async (sellerEmail) => {
    const result = await seller.find({ email: sellerEmail })
    return result;
}



// Seller profile details
const findSellerProfile = async (email) => {
    const sellerProfile = await seller.findOne({ email: email })
    return sellerProfile;
}


// Update seller profile details
const updateSellerProfile = async (email, name, company, mobileno, locality, city, state, pincode) => {
    const updateResult = await seller.findOneAndUpdate({ email: email }, { $set: { name: name, company: company, mobilenumber: mobileno, 'address.locality': locality, 'address.city': city, 'address.state': state, 'address.pincode': pincode } }, { new: true })
    return updateResult;
}


// Update seller status
const updateIsSeller = async (email) => {
    await user.updateOne({ email: email }, { isSeller: true })
    return
}




module.exports = {
    findSellerExistance,
    findSellerProfile,
    updateSellerProfile,
    updateIsSeller,
    
}