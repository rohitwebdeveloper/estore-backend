const express = require('express')
const app = express();
port = 8000 || process.env.PORT;
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db/connect/connect');
const { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, googleAuthClient, checkEmailExistence } = require('./db/crud');
const { validateEmail, validatepassword } = require('./db/validation');


// Connecting sever to the database
connectToDatabase();

// Defining Middlewares
app.use(cors());
app.use(bodyParser.json());


//  DEFINING ROUTES:-

// Route for signup request from the user
app.post('/signup', async (req, res) => {

    const {fullname, email, password } = req.body;

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
        if(result === true){
            console.log('Authorization successful')
            return res.status(200).json({ success: true, message: 'Authorization successful' })
        }else{
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



app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})