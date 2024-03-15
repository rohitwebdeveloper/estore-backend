const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    class:{
        type:Number,
        default:10
    },
    age:{
        type:Number,
        required:true
    },
    fatherName:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    }

})

const studentModel = mongoose.model("student", studentSchema);


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