const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db/connect');
require('dotenv').config({ path: '../.env' });

const { addcustomer, findEmailExistence, verifySigninDetails, userProfiledata, checkEmailExistence, resetPassword, updateProfile, generateToken } = require('./utils/userAuthentication');
const { validateEmail, validatepassword } = require('./utils/validation');
const { sendEmail } = require('./utils/sendMail');
const { generateOrder } = require('./utils/order')
const store = require('./middlewares/storeimage')
const uploadImg = require('./utils/cloudinary')
const { addproduct } = require('./utils/addproduct')
const { addseller, findSellerExistance, findSellerProfile, updateSellerProfile, updateIsSeller } = require('./utils/sellerAuthentication')
const optimizeImg = require('./utils/optimizeImg')
const { getUserWishlist, addToKart, getKartProduct, removeKartProduct, placeOrderCashpayment, placeOrderOnlinePayment, getOrder, getsellerProduct, unpublishProduct, getSellerOrder, updateSellerOrderStatus } = require('./utils/userPreferences')
const {getElectronicsProduct} = require('./utils/categoryProducts');

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

    // Validating email format at server-side
    if (!validateEmail(email)) {
        return res.status(403).json({ success: false, message: 'Invalid email format' });
    }

    try {

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
        const result = await checkEmailExistence(decoded.useremail);
        if (result === true) {
            console.log('Authorization successful')
            return res.status(200).json({ success: true, message: 'Authorization successful' })
        } else {
            return res.status(401).json({ success: false, message: 'Authorization failed' })
        }
    } catch (error) {
        console.log('authuser error');
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }
})



// Route for accessing user profile details
app.get('/users/profile/:userid', async (req, res) => {

    const usertoken = req.params.userid;

    try {
        const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET);
        const userdata = await userProfiledata(decoded.useremail)
        return res.status(200).json(userdata);
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }

})



// Route for signin with google 
app.post('/auth/user/google/sign-in', async (req, res) => {

    const { useremail } = req.body;
    // const token = jwt.sign({ email: useremail }, process.env.JWT_SECRET)

    try {
        const verifyresult = await findEmailExistence(useremail);
        if (!verifyresult.length) {
            return res.status(401).json({ success: false, message: 'Account does not exist' });
        }

        const token = await generateToken(verifyresult);

        return res.status(200).json({ success: true, message: 'SignIn successful', token });
        console.log('Google sign-in successfull')

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



// Route to generate orderid request
app.post('/user/order', async (req, res) => {
    const total = await req.body.total;
    console.log('Total:', total)
    try {
        const order = await generateOrder(total);
        return res.status(200).json({ success: true, message: 'order id generated successfully', order })

    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
        console.log(error);
    }
})



// Route to handle place order request
app.post('/user/order-place', async (req, res) => {
    const { order, userDetail, userId, razorpay_payment_id } = req.body;

    try {
        const decoded = await jwt.verify(userId, process.env.JWT_SECRET)
        if (razorpay_payment_id) {
            await placeOrderOnlinePayment(order, userDetail, decoded, razorpay_payment_id)
            return res.status(200).json({ success: true, message: 'Your order has been Placed' })
        } else {
            const result = await placeOrderCashpayment(order, userDetail, decoded)
            if (result) {
                return res.status(200).json({ success: true, message: 'Your order has been Placed' })
            } else {
                return res.status(400).json({ success: false, message: 'Failed to place order' })
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }
})



// Endpoint to get orders for a specific user based on user ID
app.get('/user/orders/:userid', async (req, res) => {
    const userToken = req.params.userid;
    try {
        const decoded = await jwt.verify(userToken, process.env.JWT_SECRET)
        const userOrders = await getOrder(decoded.userId)
        return res.status(200).json(userOrders)

    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server Error' })
    }

})



//  Route for handling post request for adding a new product to the database and and saving its image on cloud
app.post('/seller/product/publish', store.single('photo'), async (req, res) => {

    const { title, description, price, brand, category, subcategory, userid } = req.body;
    const { path } = await req.file;

    if (path == '' || path == null) {
        return res.status(403).json({ success: false, message: 'Image Not Found!, Please upload image' })
    }

    try {
        const filepath = await optimizeImg(path);
        const uploadResult = await uploadImg(filepath);
        const decoded = await jwt.verify(userid, process.env.JWT_SECRET)
        await addproduct(title, description, price, brand, category, subcategory, uploadResult.secure_url, decoded.sellerId)
        console.log('New Product Published')
        return res.status(200).json({ success: true, message: 'Your product has been published', uploadResult })

    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
        console.log(error);
    }
})



// Defining Route for seller registration
app.post('/auth/seller/register', async (req, res) => {
    const { name, email, company, mobileno, locality, city, state, pincode } = req.body.sellerForm;

    try {
        const seller = await findSellerExistance(email)
        if (seller.length) {
            return res.status(409).json({ success: false, message: 'This account already exists' })
        }

        await addseller(name, email, company, mobileno, locality, city, state, pincode)

        await updateIsSeller(email)
        

        return res.status(201).json({ success: true, message: "Registration successful" });
        // const token = await generateToken(userDetails)

        // const idResult = await sellerIdExistence(sellerId)
        // if (!idResult) {
        //     return res.status(409).json({ success: false, message: 'This SellerId is not available' })
        // }


    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }

})



// Defining Route for seller profile request
app.get('/seller/dashboard/profile/:userid', async (req, res) => {
    const sellerToken = req.params.userid;

    try {
        const decoded = await jwt.verify(sellerToken, process.env.JWT_SECRET)
        const sellerDetails = await findSellerProfile(decoded.useremail)
        return res.status(200).json(sellerDetails)
    } catch (error) {
        res.status(500).json({ success: false, message: error } || 'Internal server error')
    }
})

//  Endpoint to get all products published by seller
app.get('/seller/dashboard/product/:userid', async (req, res) => {
    const sellerToken = req.params.userid;
    try {
        const decoded = await jwt.verify(sellerToken, process.env.JWT_SECRET)
        const sellerProduct = await getsellerProduct(decoded.sellerId)
        return res.status(200).json(sellerProduct)

    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }

})



// Endpoint to Unpublish or remove product published by seller
app.get('/seller/dashboard/product/unpublish/:productid', async (req, res) => {
    const productId = req.params.productid
    try {
        const sellerProduct = await unpublishProduct(productId)
        if(sellerProduct) {
            return res.status(200).json(sellerProduct)
        }
    } catch (error) {
        res.status(500).json({success:false, message:error || 'Internal server error'})
    }
})


// Defining endpoint for seller orders
app.get('/seller/dashboard/order/:sellerid', async (req, res) => {
    const sellerId = req.params.sellerid;

    try {
        const decoded = await jwt.verify(sellerId, process.env.JWT_SECRET)
        const sellerOrder = await getSellerOrder(decoded.sellerId)
        return res.status(200).json(sellerOrder)
    } catch (error) {
        res.status(500).json({success:false, message:error || 'Internal server error'})
    }
})


// Defining endpoint for updating order status
app.patch('/seller/dashboard/order/status-update', async (req, res) => {
    const {orderStatusValue, idOrder} = req.body;
    try {
        await updateSellerOrderStatus(orderStatusValue, idOrder)
        return res.status(200).json({success:true, message:"orderstatus updated successfully"})
    } catch (error) {
        res.status(500).json({success:false, message:error || 'Internal server error'})
    }
})


// Defining Route for seller profile upadate
app.post('/seller/dashboard/profile/update', async (req, res) => {
    const { name, email, company, mobileno, locality, city, state, pincode } = req.body;

    try {
        const updateResult = await updateSellerProfile(email, name, company, mobileno, locality, city, state, pincode)
        if (updateResult) {
            return res.status(200).json({ success: true, message: 'Seller Profile Updated Successfully', updateResult })
        } else {
            return res.status(403).json({ success: false, message: 'Sorry, Unable to Update Profile', updateResult })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error || 'Internal server error' })
    }
})

app.get('/user/wishlist/:userid', async (req, res) => {
    const usertoken = req.params.userid
    try {
        const userWishlist = await getUserWishlist()
        return res.status(200).json(userWishlist)
    } catch (error) {
        res.status(500).json({ success: false, message: error } || 'Internal server error')
    }
})

app.post('/user/kart/addproduct/:userid', async (req, res) => {
    const usertoken = req.params.userid;
    const { productid } = req.body

    try {
        const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET)
        const { userId } = decoded
        const result = addToKart(userId, productid);
        if (result) {
            return res.status(200).json({ success: true, message: 'Added to Kart' })
        } else {
            return res.status(400).json({ success: false, message: "Failed to add to Kart" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error } || 'Internal server error')
    }
})

app.get('/user/kart/:userid', async (req, res) => {
    const usertoken = req.params.userid;

    try {
        const decoded = await jwt.verify(usertoken, process.env.JWT_SECRET)
        // console.log(decoded.userId)
        const kartItems = await getKartProduct(decoded.userId)
        return res.status(200).json(kartItems)
    } catch (error) {
        res.status(500).json({ success: false, message: error } || 'Internal server error')
    }
})


app.delete('/user/kart/remove-product/:productid', async (req, res) => {
    const productid = req.params.productid;

    try {
        const result = await removeKartProduct(productid)
        if (result) {
            console.log('Kart Product removed succesfully')
            return res.status(200).json('Kart Product Removed Successfully')
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error || ' Internal server error' } )
    }
})


// Endpoint to get products of electronics category
app.get('/products/category/:category', async (req, res) => {
    const {category} = req.params;
    
    try {
        const electronicsProduct = await getElectronicsProduct(category)
        return res.status(200).json({success:true, message:'Products fetched successfully', electronicsProduct})
    } catch (error) {
        res.status(500).json({success:false, message:error || 'Internal server error'})
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