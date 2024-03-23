const express = require('express')
const app = express();
port = 8000 || process.env.PORT;
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db/connect/connect');
const { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, googleAuthClient, checkEmailExistence, resetPassword } = require('./db/authentication');
const { validateEmail, validatepassword } = require('./db/validation');
const { sendEmail } = require('./db/sendMail');
// const nodemailer = require('nodemailer');


// Connecting sever to the database
connectToDatabase();

// Defining Middlewares
app.use(cors());
app.use(bodyParser.json());



//  DEFINING ROUTES:-

// Route for signup request from the user
app.post('/signup', async (req, res) => {

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
app.post('/signin', async (req, res) => {

    const { email, password } = req.body;
    const token = jwt.sign({ email: email }, 'qwertyestorekey')
    console.log(token);

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
app.post('/authuser', async (req, res) => {

    const { userid } = req.body;
    console.log(userid)
    try {
        const decoded = await jwt.verify(userid, 'qwertyestorekey');
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
app.get('/profile/:userid', async (req, res) => {

    const usertoken = req.params.userid;
    try {
        const decoded = await jwt.verify(usertoken, 'qwertyestorekey');
        const userdata = await userProfiledata(decoded.email)
        return res.status(200).json(userdata);
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }

})



// Route for signin with google 
app.post('/googlesignin', async (req, res) => {

    const { useremail } = req.body;
    const token = jwt.sign({ email: useremail }, 'qwertyestorekey')

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
app.post('/password/forget', async (req, res) => {

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



app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})