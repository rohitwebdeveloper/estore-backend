const seller = require('../models/seller')

const addseller = async (name, email, sellerId, company, mobileno, locality, city, state, pincode) => {
  try {
    const newSeller = new seller({
      name: name,
      email: email,
      sellerId: sellerId,
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
    if (result.length == 0 || result.length == null) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('Error in finding seller email existance:', error)
    throw new Error('Error in finding email')
  }
}



const sellerIdExistence = async (id) => {
  try {
    const result = await seller.find({ sellerId: id })
    if (result.length == 0 || result.length == null) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('Error in finding sellerId:', error);
    throw new Error('Error in finding sellerId')
  }
}


const findSellerProfile = async (email) => {
try {
    const sellerProfile = await seller.findOne({email:email})
    return sellerProfile;
} catch (error) {
  console.log('Error in finding seller profile details');
  throw new Error('Error in Finding seller profile details')
}
}

const updateSellerProfile = async (email, name, company, mobileno, locality, city, state, pincode) => {
  try {
      const updateResult = await seller.findOneAndUpdate({email:email}, {$set:{name:name, company:company, mobilenumber:mobileno, 'address.locality': locality, 'address.city': city, 'address.state': state,  'address.pincode': pincode}}, {new:true})
      return updateResult;
  } catch (error) {
    console.log('Error in updating seller profile details');
    throw new Error('Error in updating seller profile details')
  }
}




module.exports = { addseller, findSellerExistance, sellerIdExistence, findSellerProfile, updateSellerProfile }