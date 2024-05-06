const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{

        type:String,
        default:'Product description'
    },
    price:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        default:'Other'
    },
    category:{
        type:String,
        required: true,
        default:'Other'
    },
    subCategory:{
        type:String,
        default:'Other'

    },
    url:{
        type:String,
        required:true,
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    }

})

const product = mongoose.model('Product', productSchema);

module.exports = product;