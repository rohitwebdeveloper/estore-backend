
const { user } = require("../models/user");
const { seller } = require("../models/seller");
const jwt = require('jsonwebtoken');



const addcustomer = async (ctrfullname, ctremail, ctrpassword) => {
  try {
    const newcustomer = new user({
      name: ctrfullname,
      email: ctremail,
      password: ctrpassword
    })

    await newcustomer.save();
    console.log("New Customer Added To The Database");

  } catch (error) {
    console.log(error);
  }
}




const findEmailExistence = async (useremail) => {
  try {
    const email = await user.find({ email: useremail });
    return email
  } catch (error) {
    console.log("This is an error of Finding", error);
    throw new Error('Error in processing email');
  }
}


const checkEmailExistence = async (useremail) => {
  try {
    const result = await user.find({ email: useremail })
    if (result.length === 0 || result === null) {
      return false
    } else {
      return true
    }

  } catch (error) {
    console.log("This is an error of Checking", error);
    throw new Error('Error in processing email');
  }
}


const verifySigninDetails = async (email, password) => {
  try {
    const userData = await user.findOne({ email: email });
    // console.log("user's:" ,user )
    if (userData.password == password) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("This is an error of verify password");
    throw new Error(' Error in verifying password');
  }
}

const userProfiledata = async (email) => {
  try {
    const userData = await user.findOne({ email: email })
    return userData;
  } catch (error) {
    console.log("Error in finding userprofile data");
    throw new Error("Can't find user data, Please try again later");
  }
}




// Function to updata user password
const resetPassword = async (newpassword, email) => {
  try {
    await user.updateOne({ email: email }, { password: newpassword })
    return true;
  } catch (error) {
    console.log("Error in resetting password");
    throw new Error("Failed to reset password");
  }
}

// Function to update Seller profile
const updateProfile = async (name, email, mobileno, address) => {
  try {
    const updatedprofile = await user.findOneAndUpdate({ email: email }, { $set: { name: name, mobilenumber: mobileno, address: address } }, { new: true })
    return updatedprofile;
  } catch (error) {
    console.log("Error in updating profile");
    throw new Error('Failed to update profile')
  }
}

// Funtion to generate jwt token 
const generateToken = async (userData) => {

  try {

    if (userData[0].isSeller === true) {
      const sellerData = await seller.findOne({ email: userData[0].email })
      const token = await jwt.sign({ useremail: userData[0].email, userId: userData[0]._id, sellerId: sellerData._id }, process.env.JWT_SECRET)
      return token;

    } else {
      const token = await jwt.sign({ useremail: userData.email, userId: userData._id }, process.env.JWT_SECRET)
      return token;
    }

  } catch (error) {
    console.log("Error in generating token:", error)
    throw new Error('Failed to generate token')
  }
}


module.exports = { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, checkEmailExistence, resetPassword, updateProfile, generateToken };