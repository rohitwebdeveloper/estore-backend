const { studentModel, customerModel } = require("./model/model");
// const { OAuth2Client } = require('google-auth-library')

// const insertStudent = async (studentdetail) => {
//   try {
//     const student = new studentModel(studentdetail);
//     await student.save();
//     console.log(student)
//   } catch (error) {
//     console.log(error);
//   }
// }

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


// const updateStudent = async (studentfatherName) => {
//   try {
//     await studentModel.updateOne({ fatherName: studentfatherName }, { name: 'Om Prakash Upadhayay' });
//     console.log("Details Updated:")
//   } catch (error) {
//     console.log(error);
//   }
// }

// const findallstudent = async (detail) => {
//   try {
//     return await studentModel.find({ name: detail });

//   } catch (error) {
//     console.log(error);
//   }
// }

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
    if(result.length === 0 ) {
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
  // const googleAuth = new OAuth2Client();
  try {

    // const decodeToken = await googleAuth.verifyIdToken({
    //   idToken: userToken,
    //   audience: clientId
    // })
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


module.exports = { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, googleAuthClient, checkEmailExistence };