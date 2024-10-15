const { user } = require("../models/user");
const mongoose = require('mongoose')


// User profile
const userProfiledata = async (email) => {
    const userData = await user.findOne({ email: email })
    return userData;
}


// Update user profile
const updateProfile = async (name, email, mobileno, address) => {
    const updatedprofile = await user.findOneAndUpdate({ email: email }, { $set: { name: name, mobilenumber: mobileno, address: address } }, { new: true })
    return updatedprofile;
}


module.exports = {
    userProfiledata,
    updateProfile
}