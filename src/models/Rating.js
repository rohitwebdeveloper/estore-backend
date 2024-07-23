const mongoose = require('mongoose');



const ratingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    rateValue:{
        type:Number,
        default:0
    }
});

const rating = mongoose.model('Rating', ratingSchema)

module.exports = rating;