const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db/connect');
require('dotenv').config({ path: '../.env' });

const { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, googleAuthClient, checkEmailExistence, resetPassword, updateProfile } = require('./utils/authentication');
const { validateEmail, validatepassword } = require('./utils/validation');
const { sendEmail } = require('./utils/sendMail');
const { generateOrder } = require('./utils/order')
const store = require('./middlewares/storeimage')
const uploadImg = require('./utils/cloudinary')
const {addproduct} = require('./utils/addproduct')



// const imagePath = '../public/uploadone.png'

const port = process.env.PORT || 6000;
const app = express();

// Connecting sever to the database
connectToDatabase();

// uploadImg(imagePath);

// Defining Middlewares
app.use(cors());
app.use(bodyParser.json());



//  DEFINING ROUTES:-

// Route for signup request from the user
app.post('/auth/user/sign-up', async (req, res) => {

    const { fullname, email, password } = req.body;

    // Server-side validation of user data
    if (!validateEmail(email)) {
        return res.status(403).json({ success: false, message: 'Invalid email format' });
    }
    if (!validatepassword(password)) {
        return res.status(403).json({ success: false, message: 'Password must be atleast 8 character' });
    }

    try {
        // Checking email already exists or not 
        const emailverify = await findEmailExistence(email);
        if (emailverify.length != 0) {
            return res.status(409).json({ success: false, message: "This email already exists" });
        }
        // If email is unique then adding it to the database 
        await addcustomer(fullname, email, password);
        console.log('Sign-Up successful');
        return res.status(201).json({ success: true, message: "Sign-up successful" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
})



// Defining route for login request from the user
app.post('/auth/user/sign-in', async (req, res) => {

    const { email, password } = req.body;
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET)
    // console.log("Email:", email, "Password:", password);

    // Validating email format at server-side
    if (!validateEmail(email)) {
        return res.status(403).json({ success: false, message: 'Invalid email format' });
    }

    try {

        const verifyemail = await findEmailExistence(email)
        if (verifyemail.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email' });
        }

        const verifypassword = await verifySigninDetails(email, password);
        if (verifypassword == true) {
            console.log('Sign-In successful');
            return res.status(200).json({ success: true, message: 'Sign-in successful', token })
        } else {
            return res.status(401).json({ success: false, message: "Invalid password" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' })
    }
})



// Authentication of user without signin on website visit
app.post('/auth/user/verify-user', async (req, res) => {

    const { userid } = req.body;
    // console.log(userid)
    try {
        const decoded = await jwt.verify(userid, process.env.JWT_SECRET);
        const result = await checkEmailExistence(decoded.email);
        if (result === true) {
            console.log('Authorization successful')
            return res.status(200).json({ success: true, message: 'Authorization successful' })
        } else {
            return res.status(401).json({ success: false, message: 'Authorization failed' })
        }
    } catch (error) {
        console.log('authuser error', error);
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }
})



// Route for accessing user profile details
app.get('/users/profile/:userid', async (req, res) => {

    const usertoken = req.params.userid;
    try {
        const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET);
        const userdata = await userProfiledata(decoded.email)
        return res.status(200).json(userdata);
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }

})



// Route for signin with google 
app.post('/auth/user/google/sign-in', async (req, res) => {

    const { useremail } = req.body;
    const token = jwt.sign({ email: useremail }, process.env.JWT_SECRET)

    try {
        const verifyresult = await googleAuthClient(useremail);
        if (verifyresult === true) {
            console.log('Google sign-in successfull')
            return res.status(200).json({ success: true, message: 'SignIn successful', token });
        } else {
            return res.status(401).json({ success: false, message: 'Account does not exist' });
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(500).json({ success: false, message: 'Invalid token' });
    }
});



// Route for forget password to send verification code on user's email
app.post('/auth/user/forget-password', async (req, res) => {

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
    try {

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
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
        console.log('Server..js error:', error);
    }
})



// Route for reseting account password
app.patch('/auth/user/reset-password', async (req, res) => {

    const { newpassword, emailverified } = req.body;
    // console.log(newpassword, emailverified);

    try {
        const resetResult = await resetPassword(newpassword, emailverified)
        if (resetResult) {
            return res.status(200).json({ success: true, message: 'newpassword received successfully' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
        console.log('Server..js error:', error);
    }
})


// Route for user profile details update request
app.patch('/user/profile/update', async (req, res) => {
    const { name, email, mobileno, address } = req.body;

    try {
        const updateResult = await updateProfile(name, email, mobileno, address);
        if (updateResult) {
            return res.status(200).json({ success: true, message: 'Profile details updated successfully', updateResult })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
        console.log('Server..js error:', error);
    }
})



app.get('/user/order', async (req, res) => {

    const order = await generateOrder();
    res.status(200).json({ success: true, message: 'order id generated successfully', order })
})


app.post('/upload/image', store.single('photo'), async (req, res) => {

    const { title, description, price, category, subcategory } = req.body;
    // console.log(title, description, price, category, subcategory);
    const { path } = await req.file;

    if (path == '' || path == null) {
        return res.status(403).json({ success: false, message: 'Image Not Found!, Please upload image' })
    }

    try {
        const uploadResult = await uploadImg(path);
        console.log("Product Image Uploaded");
        await addproduct(title, description, price, category, subcategory, uploadResult.secure_url)
        console.log('New Product Added')
        return res.status(200).json({ success: true, message: 'Image Uploaded on Cloudnary successfully', uploadResult })
        
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
        console.log(error);
    }
})



app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})


// const rasorpay = require('razorpay');

// const instance = new rasorpay({ key_id:process.env.KEY_ID, key_secret:process.env.KEY_SECRET })

// var { validatePaymentVerification } = require('../node_modules/dist/utils/razorpay-utils');

// const orderresult = validatePaymentVerification({"order_id": "order_Nrhjm62zyNcenN", "payment_id": "pay_NrhoHSVLuhAzXx" }, "90bac0dec911df3b617da4af180396760347b1d7e0ab04de2f5d35c818d601d2", 'm1HXTP8tTwsqdOSpZmdUpLy9');
// console.log(orderresult);