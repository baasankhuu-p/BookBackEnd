const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/CustomError");
const Delivery = require("../Models/deliveryd");
const Customer = require("../Models/customers");
const Order = require("../Models/orders");
const Order2Book = require("../Models/o2b.js");
exports.getDeliveries = asyncHandler(async (req, res, next) => {
  let data = [];
  const deliveries = await Delivery.find().populate("CustomerId");
  if (!deliveries || deliveries.length == 0) {
    throw new CustomError("Захиалгын мэдээлэл байхгүй байна");
  }
  for (const delivery of deliveries) {
    const order = await Order.findOne({
      DeliverID: delivery._id,
    })
      .select("CustomerId")
      .populate({
        path: "PaymentID",
        select: "PaymentRndID TotalPrice",
      })
      .populate({
        path: "DeliverID",
        select: "DeliveryDate",
      });
    if (!order || order.length == 0) {
      throw new CustomError("Захиалгын мэдээлэл байхгүй байна");
    }
    const o2book = await Order2Book.find({
      OrderID: order._id,
    }).populate("BookId");
    data.push({ delivery, Orderdata: o2book, Payment: order.PaymentID });
  }
  return res.status(200).json({
    success: true,
    data: data,
  });
});
exports.getDelivery = asyncHandler(async (req, res, next) => {
  var items = [],
    data = [];
  if (!req.user || !req.email) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }
  const deliveries = await Delivery.find({ CustomerId: req.user });
  if (!deliveries) {
    throw new CustomError("Одоогоор хүргэлт хийгээгүй байна", 404);
  }
  for (const delivery of deliveries) {
    const orders = await Order.find({ DeliverID: delivery.id });
    if (!orders || orders.length == 0) {
      throw new CustomError(`Хүргэлт хийгдээгүй байна`, 400);
      continue;
    }
    for (const order of orders) {
      const o2b = await Order2Book.find({ OrderID: order.id }).populate({
        path: "BookId",
        select: "photo",
      });
      o2b.forEach((item) => {
        items.push(item);
      });
    }
    data.push({ item: items, date: delivery.DeliveryDate });
    items = [];
  }

  res.status(200).json({
    success: true,
    data: data,
  });
  res.end();
});
exports.notDeliveries = asyncHandler(async (req, res, next) => {
  let data = [];
  const orders = await Order.find({
    Delivere: false,
    Checked: true,
  })
    .populate("CustomerId")
    .populate("PaymentID");
  if (!orders || orders.length == 0) {
    throw new CustomError("Захиалгын мэдээлэл байхгүй байна");
  }
  for (const order of orders) {
    const order2book = await Order2Book.find({
      OrderID: order._id,
    }).populate("BookId");
    data.push({ Orderdata: order, item: order2book });
  }
  return res.status(200).json({
    success: true,
    data: data,
  });
});
exports.createdelivery = asyncHandler(async (req, res, next) => {
  const { customerId, OrderID } = req.body;
  const customer = await Customer.findById(customerId);
  if (!customerId || !customer) {
    throw new CustomError(
      `${customerId} ийм ID-тэй үйлчлүүлэгч олдсонгүй`,
      404
    );
  }
  const delivery = {
    CustomerId: customerId,
  };
  const deliverOrders = await Order.find({
    _id: OrderID,
    CustomerId: customerId,
    Checked: true,
    Delivere: false,
  });
  if (!deliverOrders || deliverOrders.length === 0) {
    throw new CustomError(`Захиалга байхгүй байна`, 404);
  }

  const delivered = await Delivery.create(delivery);

  await Order.updateMany(
    { _id: OrderID, CustomerId: customerId, Delivere: false },
    { Delivere: true, DeliverID: delivered.id }
  );

  return res.status(200).json({
    success: true,
    data: delivered,
  });
});
