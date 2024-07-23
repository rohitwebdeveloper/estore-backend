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
        default:'None'
    },
    category:{
        type:String,
        required: true,
        default:'None'
    },
    subCategory:{
        type:String,
        default:'None'

    },
    url:{
        type:String,
        required:true,
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    },
    ratingValue: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
      }],

})

const product = mongoose.model('Product', productSchema);

module.exports = product;