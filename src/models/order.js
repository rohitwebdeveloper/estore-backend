const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderitem: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    orderid: {
        type: String,
        required: true
    },
    paymentid: {
        type: String,
        default: 'None'
    },
    orderdate: {
        type: Date,
        default: Date.now
    },
    totalamount: {
        type: Number,
        required: true
    },
    payment: {
        mode: String,
        status: {
            type: String,
            enum: ['Complete', 'Due'],
            default: 'Due'
        }
    },
    customerDetails: {
        name: String,
        mobilenumber: String,
        locality: String,
        city: String,
        pincode: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true
        },
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending'
    }

})

const order = mongoose.model('Order', orderSchema);

module.exports = { order };