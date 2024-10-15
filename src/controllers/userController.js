const jwt = require('jsonwebtoken');
const { userProfiledata, updateProfile} = require('../services/userService')


// Controller for user profile
const userProfile = async (req, res) => {

    const usertoken = req.params.userid;
    const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET);
    const userdata = await userProfiledata(decoded.useremail)
    return res.status(200).json(userdata);
}


// Controller for user profile update
const userProfileUpdate = async (req, res) => {

    const { name, email, mobileno, address } = req.body;
    const updateResult = await updateProfile(name, email, mobileno, address);
        if (updateResult) {
            return res.status(200).json({ success: true, message: 'Profile details updated successfully', updateResult })
        }
   }



module.exports = {
    userProfile,
    userProfileUpdate,
    
}