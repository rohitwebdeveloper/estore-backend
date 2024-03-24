const mongoose = require('mongoose');

const customerSchema  = new mongoose.Schema({

    name:{
        type:String,
        default:"Customer Name"
    },
    email:{
        type:String,
        default:'customer@gmail.com',
        unique:true
    },
    password:{
        type:String,
        default:'password'
    },
    mobilenumber:{
        type:Number,
        default:9997193344
    },
    address:{
        type:String,
        default:'Address'
    }

})

const customerModel = mongoose.model("customer", customerSchema);


module.exports = {customerModel};