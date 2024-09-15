const product = require('../models/product')
const { kart } = require('../models/kart')
const mongoose = require('mongoose')
const { order } = require('../models/order')
const {wishlist} = require('../models/wishlist')
const rating = require('../models/Rating')
const { updateOne } = require('../models/product')

// const {product} = require('../models/product')

const getUserWishlist = async (userId) => {
  try {
    const wishlistItem = await wishlist.aggregate([
      {
        $match:{
          user:new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup:{
          from:'products',
          localField:'product',
          foreignField:'_id',
          as:'productDetails',
        }
      },
      {
        $addFields:{
          productdetail:{
            $arrayElemAt:['$productDetails', 0]
          }
        }
      },
    ])
    return wishlistItem

  } catch (error) {
    console.log(error)
    throw new Error('Error in getting user wishlist')
  }
}

const addToKart = async (userId, productid) => {
  try {
    const KartProduct = new kart({
      user: userId,
      product: productid
    })
    await KartProduct.save()
    console.log('Product Added in Kart')
    return true
  } catch (error) {
    console.log('Error in Adding to Kart')
    throw new Error('Error in Adding to Kart')
  }
}

const getKartProduct = async (userId) => {
  try {
    const KartItems = await kart.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        },
      },
      {
        $addFields: {
          productdetail: {
            $arrayElemAt: ['$productDetails', 0]
          }
        }
      },
      {
        $project: {
          productdetail: 1
        }
      }
    ])
    // console.log(KartItems)
    return KartItems
  } catch (error) {
    console.log('Error in Finding Kart Products', error)
  }
}


const removeKartProduct = async (productid) => {
  try {
    await kart.deleteOne({ _id: productid })
    return true
  } catch (error) {
    console.log('Error in Removing Kart Product')
  }
}


const placeOrderCashpayment = async (orderdetail, userDetail, decoded) => {

  try {
    const orderitems = orderdetail[0].map((element, index) => {
      return {
        product: element.productdetail._id,
        quantity: orderdetail[1][index],
        subtotal: orderdetail[2][index]
      }
    });

    const newOrder = new order({
      user: decoded.userId,
      orderitem: orderitems,
      orderid: orderdetail[4],
      totalamount: orderdetail[3],
      payment: {
        mode: 'Cash On Delivery',
        status: 'Due'
      },
      customerDetails: {
        name: userDetail.name,
        mobilenumber: userDetail.mobileno,
        locality: userDetail.address,
        city: userDetail.city,
        pincode: userDetail.pincode,
        state: userDetail.state
      }
    })
    await newOrder.save()
    console.log('Order has been placed')
    return true
  } catch (error) {
    console.log('Error in placing order')
    throw new Error('Error in placing order')
  }
}


const placeOrderOnlinePayment = async (orderdetail, userDetail, decoded, paymentId) => {

  try {
    const orderitems = orderdetail[0].map((element, index) => {
      return {
        product: element.productdetail._id,
        quantity: orderdetail[1][index],
        subtotal: orderdetail[2][index]
      }
    });

    const newOrder = new order({
      user: decoded.userId,
      orderitem: orderitems,
      orderid: orderdetail[4],
      paymentid: paymentId,
      totalamount: orderdetail[3],
      payment: {
        mode: 'Online Payment',
        status: 'Complete'
      },
      customerDetails: {
        name: userDetail.name,
        mobilenumber: userDetail.mobileno,
        locality: userDetail.address,
        city: userDetail.city,
        pincode: userDetail.pincode,
        state: userDetail.state
      }
    })
    await newOrder.save()
    console.log('Order has been placed')
    return true
  } catch (error) {
    console.log('Error in placing order')
    throw new Error('Error in placing order')
  }
}


const getOrder = async (userId) => {
  try {
    // const userOrders = await order.find({user:userId})
    const userOrders = await order.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      { $unwind: "$orderitem" },
      {
        $lookup: {
          from: 'products',
          localField: 'orderitem.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
  
      {
        $addFields: {
          "orderitem.producturl": { $arrayElemAt: ["$productDetails.url", 0] },
          "orderitem.producttile": { $arrayElemAt: ["$productDetails.title", 0] }
        }
      },
      {
        $lookup: {
          from:'ratings',
          localField:'orderitem.rating',
          foreignField:'_id',
          as: 'productRating',
        }
      },
      {
        $addFields: {
          "orderitem.rating": { $arrayElemAt: ["$productRating.rateValue", 0] }
        }
      },
      
      { $unset: "productDetails" },
      {
        $group: {
          _id: "$_id",
          orderitems: { $push: "$orderitem" },
          // user: { $first: "$user" },
          orderid: { $first: "$orderid" },
          // paymentid: { $first: "$paymentid" },
          totalamount: { $first: "$totalamount" },
          // payment: { $first: "$payment" },
          // customerDetails: { $first: "$customerDetails" },
          status: { $first: "$status" },
          orderdate: { $first: "$orderdate" }
        }
      },
    ])
    return userOrders
  } catch (error) {
    console.log('Error in finding user orders', error)
    throw new Error('Error in finding user orders')
  }
}


const getsellerProduct = async (sellerid) => {
  try {
    const sellerproduct = await product.find({seller:sellerid})
    return sellerproduct
  } catch (error) {
    console.log('Error in finding seller product', error)
    throw new Error('Error in finding seller product')
  }
}


const unpublishProduct = async (productId) => {
  try {
     await product.deleteOne({_id:productId})
    return true
  } catch (error) {
    throw new Error("Error in unpublishing seller product")
  }
}


const getSellerOrder = async (sellerId) => {
  try {
 const sellerorder = await order.aggregate([
      {
        $unwind:"$orderitem"
      },
      {
        $lookup:{
          from:'products',
          localField:'orderitem.product',
          foreignField:'_id',
          as:'productDetails'
        }
      },
      {
        $match:{
          "productDetails.seller":new mongoose.Types.ObjectId(sellerId)
        }
      },
      {
        $addFields:{
          'orderitem.producturl':{$arrayElemAt: ['$productDetails.url', 0]},
          'orderitem.producttitle':{$arrayElemAt: ['$productDetails.title', 0]},
          'orderitem.productprice':{$arrayElemAt: ['$productDetails.price', 0]}
        }
      },
      { $unset:'productDetails' },
      {
        $group:{
          _id:'$_id',
          orderitems:{$push:'$orderitem'},
          orderid:{$first:'$orderid'},
          orderdate:{$first:'$orderdate'},
          paymentid:{$first:'$paymentid'},
          payment:{$first:'$payment'},
          status:{$first:'$status'},
          totalamount:{$first:'$totalamount'},
          customerDetails:{$first:'$customerDetails'}
        }
      }

     ])
     return sellerorder;
  } catch (error) {
    throw new Error("Error in finding seller orders")
  }
}


const updateSellerOrderStatus = async (orderStatusValue, idOrder) => {
  try {
     await order.updateOne({_id:idOrder}, {status:orderStatusValue})
     return
  } catch (error) {
    throw new Error('Error in updating seller order status')
  }
}


const addToWishlist = async (userId, productId) => {
  try {
     const wishlistItem = new wishlist({
      user:userId,
      product:productId
     })
     await wishlistItem.save()
     return
  } catch (error) {
    console.log('Error in adding to wishlist')
    throw new Error('Error in adding to wishlist', error)
  }
}


const saveRating = async (userid, productid, ratedVal, orderId, orderitemId) => {
  try {
    const productRating = new rating({
      userId:userid,
      productId:productid,
      rateValue:ratedVal
    })
  const savedRating =  await productRating.save()
  const updatedOrder = await order.updateOne({orderid:orderId, 'orderitem._id':mongoose.Types.ObjectId(orderitemId)}, {$set: {'orderitem.$.rating':savedRating._id}})
    return true;
  } catch (error) {
    console.log('Error in saving rating', error)
    throw new Error('Error in saving rating', error)
  }
}



const removeWishlistProduct = async (productid) => {
  try {
     await wishlist.deleteOne({_id:productid})
     return true;
  } catch (error) {
    console.log('Error in removing wishlist product', error)
    throw new Error('Error in removing wishlist product', error)
  }
}


const getproduct = async (productid) => {
  try {
  //  const productdetails = await product.find({_id:productid})
  //   return productdetails;

  const productdetails = await product.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(productid)
      }
    },
    {
      $lookup: {
        from: 'ratings', 
        localField: '_id', 
        foreignField: 'productId', 
        as: 'ratings' 
      }
    },
    {
      $addFields: {
        averagerating: { $avg: '$ratings.rateValue' } 
      }
    }
  ])

  return productdetails

  } catch (error) {
    throw new Error('Error in getting product details')
  }
}



const getSearchData = async (searchVal) => {
  try {
    // const result = await product.find({$or:[{title:searchVal}, {subCategory:searchVal}, {category:searchVal}, {brand:searchVal}] })
    // return result
     // Create a regex pattern for flexible matching
     const regexPattern = new RegExp(searchVal.split('').join('.*'), 'i');

     // Perform the search using the regex pattern
     const result = await product.find({
       $or: [
         { title: { $regex: regexPattern } },
         { subCategory: { $regex: regexPattern } },
         { category: { $regex: regexPattern } },
         { brand: { $regex: regexPattern } }
       ]
     });
 
     return result;
  } catch (error) {
   throw new Error('Error in searching product') 
  }
}



module.exports = {
  getUserWishlist,
  addToKart,
  getKartProduct,
  removeKartProduct,
  placeOrderCashpayment,
  placeOrderOnlinePayment,
  getOrder,
  getsellerProduct,
  unpublishProduct,
  getSellerOrder,
  updateSellerOrderStatus,
  addToWishlist,
  saveRating,
  removeWishlistProduct,
  getproduct,
  getSearchData
};