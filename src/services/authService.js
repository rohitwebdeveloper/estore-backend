const { user } = require("../models/user");
const { seller } = require('../models/seller')
const mongoose = require('mongoose')

// Add new user
const addcustomer = async (ctrfullname, ctremail, ctrpassword) => {
    const newcustomer = new user({
        name: ctrfullname,
        email: ctremail,
        password: ctrpassword
    })
    await newcustomer.save();
    console.log("New Customer Added To The Database");
}



// Find email 
const findEmailExistence = async (useremail) => {
    const email = await user.find({ email: useremail });
    return email
}



// Check whether email exists or not
const checkEmailExistence = async (useremail) => {
    const result = await user.find({ email: useremail })
    if (result.length === 0 || result === null) {
        return false
    } else {
        return true
    }
}


// Verify login details
const verifySigninDetails = async (email, password) => {

    const userData = await user.findOne({ email: email });
    if (userData.password == password) {
        return true
    } else {
        return false
    }
}



// update user password
const resetPassword = async (newpassword, email) => {
    await user.updateOne({ email: email }, { password: newpassword })
    return true;
}


// Register new seller
const addseller = async (name, email, company, mobileno, locality, city, state, pincode) => {
    const newSeller = new seller({
        name: name,
        email: email,
        company: company,
        mobilenumber: mobileno,
        address: {
            locality: locality,
            city: city,
            state: state,
            pincode: pincode
        }
    })
    await newSeller.save()
    return
}



module.exports = {
    addcustomer,
    findEmailExistence,
    checkEmailExistence,
    verifySigninDetails,
    resetPassword,
    addseller
}