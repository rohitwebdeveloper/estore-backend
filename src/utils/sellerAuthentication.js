const { seller } = require('../models/seller')
const { user } = require('../models/user')

const addseller = async (name, email, sellerId, company, mobileno, locality, city, state, pincode) => {
  try {
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
  } catch (error) {
    console.log('Error in Adding Seller:', error)
    throw new Error('Error in Adding Seller')
  }
}




const findSellerExistance = async (sellerEmail) => {
  try {
    const result = await seller.find({ email: sellerEmail })
    return result;
  } catch (error) {
    console.log('Error in finding seller email existance:', error)
    throw new Error('Error in finding email')
  }
}




const findSellerProfile = async (email) => {
  try {
    const sellerProfile = await seller.findOne({ email: email })
    return sellerProfile;
  } catch (error) {
    console.log('Error in finding seller profile details');
    throw new Error('Error in Finding seller profile details')
  }
}

const updateSellerProfile = async (email, name, company, mobileno, locality, city, state, pincode) => {
  try {
    const updateResult = await seller.findOneAndUpdate({ email: email }, { $set: { name: name, company: company, mobilenumber: mobileno, 'address.locality': locality, 'address.city': city, 'address.state': state, 'address.pincode': pincode } }, { new: true })
    return updateResult;
  } catch (error) {
    console.log('Error in updating seller profile details');
    throw new Error('Error in updating seller profile details')
  }
}

const updateIsSeller = async (email) => {

  try {
    await user.updateOne({ email: email }, { isSeller: true })
    return
  } catch (error) {
    console.log("Error in updating IsSeller")
    throw new Error('Failed to register seller ')
  }
}




module.exports = { addseller, findSellerExistance, findSellerProfile, updateSellerProfile, updateIsSeller }