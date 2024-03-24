const { customerModel } = require("./model/model");


const addcustomer = async (ctrfullname, ctremail, ctrpassword) => {
  try {
    const newcustomer = new customerModel({
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
    const email = await customerModel.find({ email: useremail });
    return email
  } catch (error) {
    console.log("This is an error of Finding", error);
    throw new Error('Error in processing email');
  }
}


const checkEmailExistence = async (useremail) =>{
  try{
    const result = await customerModel.find({email:useremail})
    if(result.length === 0 || result===null ) {
      return false
    }else{
      return true
    }

  } catch (error) {
    console.log("This is an error of Checking", error);
    throw new Error('Error in processing email');
  }
}


const verifySigninDetails = async (customerEmail, customerpassword) => {
  try {
    const user = await customerModel.findOne({ email: customerEmail });
    // console.log("user's:" ,user )
    if (user.password == customerpassword ) {
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
    const userData = await customerModel.findOne({ email: email })
    return userData;
  } catch (error) {
    console.log("Error in finding userprofile data");
    throw new Error("Can't find user data, Please try again later");
  }
}


// User login using google authentication
const googleAuthClient = async (useremail) => {

  try {
     const result = await customerModel.findOne({email:useremail})
      if (result) {
        return true
      } else {
        return false
      }

  } catch (error) {
    console.log("Error in Google Verification");
    throw new Error("Error in Google Verification")
  }
}


// Function to updata user password
const resetPassword = async (newpassword, email)=>{
  try {
    await customerModel.updateOne({email:email}, {password:newpassword})
    return true;
  } catch (error) {
    console.log("Error in resetting password");
    throw new Error("Failed to reset password");
  }
}


const updateProfile = async (name, email, mobileno, address) =>{
     try{
      const updatedprofile = await customerModel.findOneAndUpdate({email:email}, {$set:{name:name, mobilenumber:mobileno, address:address}}, {new:true})
        return updatedprofile;
     }catch (error) {
      console.log("Error in updating profile");
      throw new Error('Failed to update profile')
     }
}


module.exports = { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, googleAuthClient, checkEmailExistence, resetPassword, updateProfile };