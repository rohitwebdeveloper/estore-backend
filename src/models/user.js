const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({

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
    },
    isSeller:{
        type:Boolean,
        default:false
    }

})

const user = mongoose.model("User", userSchema);


module.exports = {user};