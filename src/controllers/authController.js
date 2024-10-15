const {validateEmail, validatepassword} = require('../utils/validation')
const generateToken = require('../utils/token')
const { sendEmail } = require('../utils/sendMail');
const jwt = require('jsonwebtoken');
const {findEmailExistence, verifySigninDetails, addcustomer, checkEmailExistence, resetPassword, addseller} = require('../services/authService')
const {findSellerExistance, updateIsSeller} = require('../services/sellerService')



// Controller for User Login
const signInUser = async (req, res) => {

    const { email, password } = req.body;
    // Validating email format at server-side
    if (!validateEmail(email)) {
        return res.status(403).json({ success: false, message: 'Invalid email format' });
    }

    const verifyemail = await findEmailExistence(email)
    if (verifyemail.length === 0) {
        return res.status(401).json({ success: false, message: 'Email does not exists' });
    }

    const token = await generateToken(verifyemail)
    const verifypassword = await verifySigninDetails(email, password);

    if (verifypassword == true) {
        console.log('Sign-In successful');
        return res.status(200).json({ success: true, message: 'Sign-in successful', token })
    } else {
        return res.status(401).json({ success: false, message: "Invalid password" })
    }
}



// Controller for User SignUp
const signUpUser = async (req, res) => {

    const { fullname, email, password } = req.body;
    // Server-side validation of user data
    if (!validateEmail(email)) {
        return res.status(403).json({ success: false, message: 'Invalid email format' });
    }
    if (!validatepassword(password)) {
        return res.status(403).json({ success: false, message: 'Password must be atleast 8 character' });
    }

    // Checking email already exists or not 
    const emailverify = await findEmailExistence(email);
    if (emailverify.length != 0) {
        return res.status(409).json({ success: false, message: "This email already exists" });
    }
    // If email is unique then adding it to the database 
    await addcustomer(fullname, email, password);
    console.log('Sign-Up successful');
    return res.status(201).json({ success: true, message: "Sign-up successful" });
}



// Controller to verify current user
const verifyUser = async (req, res) => {

    const { userid } = req.body;
    const decoded = await jwt.verify(userid, process.env.JWT_SECRET);
    const result = await checkEmailExistence(decoded.useremail);
    if (result === true) {
        console.log('Authorization successful')
        return res.status(200).json({ success: true, message: 'Authorization successful' })
    } else {
        return res.status(401).json({ success: false, message: 'Authorization failed' })
    }
}


// Controller for User signin with google
const googleSignInUser = async (req, res) => {

    const { useremail } = req.body;
    const verifyresult = await findEmailExistence(useremail);
    if (!verifyresult.length) {
        return res.status(401).json({ success: false, message: 'Account does not exist' });
    }

    const token = await generateToken(verifyresult);
    console.log('Google sign-in successfull')
    return res.status(200).json({ success: true, message: 'SignIn successful', token });
}



// Controller for forget password
const forgetPassword = async (req, res) => {

    const { useremail } = await req.body;
    const verificationCode = Math.floor(Math.random() * 1000000)

    const emailContent = {
        from: 'rohitkushwaha.developer@gmail.com',
        to: useremail,
        subject: 'Verification for password recovery',
        html: `
        <h3>Dear User,</h3>
        <p>Hello, You recently requested to reset your password for your account with E-Store. To complete the password reset process, please use the following verification code: </p>
        <p> Verification Code: <b>${verificationCode}</b></p>
        <p>Please enter this code on the password reset page to proceed with resetting your password.</p>
        <p>With regards, Team E-Store</p>
        `
    }

    const result = await checkEmailExistence(useremail)
    if (!result) {
        return res.status(401).json({ success: false, message: 'Account does not exist, Please sign-up' })
    }

    const sendResponse = await sendEmail(emailContent);
    if (sendResponse.accepted.length > 0 && sendResponse.rejected.length === 0) {
        return res.status(250).json({ success: true, message: `Email has been sent to ${useremail},`, verificationCode })
    } else {
        return res.status(424).json({ success: false, message: 'Failed to sent Email' })
    }
}



// Controller of password reset
const passwordReset = async (req, res) => {

    const { newpassword, emailverified } = req.body;
    const resetResult = await resetPassword(newpassword, emailverified)
    if (resetResult) {
        return res.status(200).json({ success: true, message: 'newpassword received successfully' })
    }
}



// Controller for seller register
const sellerRegister = async (req, res) => {

    const { name, email, company, mobileno, locality, city, state, pincode } = req.body.sellerForm;
    const seller = await findSellerExistance(email)
    if (seller.length) {
        return res.status(409).json({ success: false, message: 'This account already exists' })
    }

    await addseller(name, email, company, mobileno, locality, city, state, pincode)
    await updateIsSeller(email)
    return res.status(201).json({ success: true, message: "Registration successful" });
}



module.exports = {
    signInUser,
    signUpUser,
    verifyUser,
    googleSignInUser,
    forgetPassword,
    passwordReset,
    sellerRegister
}