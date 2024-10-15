const jwt = require('jsonwebtoken');
const { seller } = require("../models/seller");

const generateToken = async (userData) => {

    try {
  
      if (userData[0].isSeller === true) {
        const sellerData = await seller.findOne({ email: userData[0].email })
        const token = jwt.sign({ useremail: userData[0].email, userId: userData[0]._id, sellerId: sellerData._id }, process.env.JWT_SECRET)
        return token;
  
      } else {
        const token = await jwt.sign({ useremail: userData[0].email, userId: userData[0]._id }, process.env.JWT_SECRET)
        return token;
      }
  
    } catch (error) {
      console.log("Error in generating token:", error)
      throw new Error('Failed to generate token')
    }
  }

  module.exports = generateToken