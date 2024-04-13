const mongoose = require('mongoose');
const { Product } = require('./product');

// const kartSchema = new mongoose.Schema({

//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User'
//     },
//     kartitem:[
//         {
//             product:{
//                 type:mongoose.Schema.Types.ObjectId,
//                 ref:'Product'
//             },
//             quatity:{
//                 type:Number,
//                 default:0
//             }
//         }
//     ]

// })


const kartSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        default:0
    }
})

const kart = mongoose.model('Kart', kartSchema);

module.exports = {kart};

