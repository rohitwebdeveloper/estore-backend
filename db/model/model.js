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
    }

})

const customerModel = mongoose.model("customer", customerSchema);


module.exports = {studentModel, customerModel};