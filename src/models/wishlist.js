const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    wishlistitem:[
        {
           product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:Product
           },
           kartstatus:{
            type:Boolean,
            default:false
           }
        }
    ]

})

const wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = {wishlist};