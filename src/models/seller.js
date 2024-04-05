const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        default:'Seller Name'
    },
    email:{
        type:String,
        required:true,
        unique:true,
        default:'Email'
    },
    sellerId:{
        type:String,
        required:true,
        unique:true,
        unique:true
    },
    mobilenumber:{
        type:Number,
        required:true
    },
    address:{
        locality:String,
        city:String,
        state:String,
        pincode:Number

    }
})

const seller = mongoose.model('Seller', sellerSchema)
module.exports = seller;