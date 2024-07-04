const product = require('../models/product')
const { kart } = require('../models/kart')
const mongoose = require('mongoose')
const { order } = require('../models/order')

const getUserWishlist = async () => {
  try {
    const wishlist = await product.find()
    return wishlist

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
      }
    ])
    return userOrders
  } catch (error) {
    console.log('Error in finding user orders', error)
    throw new Error('Error in finding user orders')
  }
}


module.exports = { getUserWishlist, addToKart, getKartProduct, removeKartProduct, placeOrderCashpayment, placeOrderOnlinePayment, getOrder };