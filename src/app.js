const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes')
const productsRoutes = require('./routes/productsRoutes')
const ordersRoutes = require('./routes/ordersRoutes')
const kartRoutes = require('./routes/kartRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const sellerRoutes = require('./routes/sellerRoutes')
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./utils/errorHandler')

// Creating express app
const app = express();


// Defining Middlewares
app.use(cors())
app.use(bodyParser.json())


// Defining Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/kart', kartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/seller', sellerRoutes)
app.use('/api/user', userRoutes)

// Handle error
app.use(errorHandler)


module.exports = app;




