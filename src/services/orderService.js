const mongoose = require('mongoose')
const { order } = require('../models/order')


// Place order with cash payment
const placeOrderCashpayment = async (orderdetail, userDetail, decoded) => {

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
}



// Place order with online payment  
const placeOrderOnlinePayment = async (orderdetail, userDetail, decoded, paymentId) => {

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
}



// User orders
const getOrder = async (userId) => {

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
        from: 'ratings',
        localField: 'orderitem.rating',
        foreignField: '_id',
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
}


// Seller orders
const getSellerOrder = async (sellerId) => {

  const sellerorder = await order.aggregate([
    {
      $unwind: "$orderitem"
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orderitem.product',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    {
      $match: {
        "productDetails.seller": new mongoose.Types.ObjectId(sellerId)
      }
    },
    {
      $addFields: {
        'orderitem.producturl': { $arrayElemAt: ['$productDetails.url', 0] },
        'orderitem.producttitle': { $arrayElemAt: ['$productDetails.title', 0] },
        'orderitem.productprice': { $arrayElemAt: ['$productDetails.price', 0] }
      }
    },
    { $unset: 'productDetails' },
    {
      $group: {
        _id: '$_id',
        orderitems: { $push: '$orderitem' },
        orderid: { $first: '$orderid' },
        orderdate: { $first: '$orderdate' },
        paymentid: { $first: '$paymentid' },
        payment: { $first: '$payment' },
        status: { $first: '$status' },
        totalamount: { $first: '$totalamount' },
        customerDetails: { $first: '$customerDetails' }
      }
    }

  ])
  return sellerorder;
}



// Update order status
const updateSellerOrderStatus = async (orderStatusValue, idOrder) => {
     await order.updateOne({_id:idOrder}, {status:orderStatusValue})
     return
}



module.exports = {
  placeOrderCashpayment,
  placeOrderOnlinePayment,
  getOrder,
  getSellerOrder,
  updateSellerOrderStatus,
}