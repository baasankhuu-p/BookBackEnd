const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/CustomError");
const Order = require("../Models/orders");
const Customer = require("../Models/customers");
const Payment = require("../Models/payment");
const paginate = require("../utils/paginate");
const random = require("../utils/RndCode");
exports.getPays = asyncHandler(async (req, res, next) => {
  //Бүх төлбөрийн мэдээллийг үйлчлэгчийн нэртэй хамт харуулах
  const select = req.query.select || {};
  const sort = req.query.sort || { OrderDate: -1 };
  ["select"].forEach((el) => delete req.query[el]);
  //deer ajilj ehelsn query-g huleegd duushaar doosh huselt shidne
  const pays = await Order.find({ ...req.query, Checked: true }, select)
    .sort(sort)
    .populate({
      path: "CustomerId",
      select: "lname fname email phone",
    })
    .populate({
      path: "PaymentID",
      select: "PaymentRndID PaymentDate",
    });
  res.status(200).json({
    success: true,
    data: pays,
  });
});

exports.getPay = asyncHandler(async (req, res, next) => {
  //үйлчлэгчийн төлсөн төлбөрийн мэдээллийг энэд авах
  if (!req.user.length) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }
  const payment = await Order.find({
    CustomerId: req.user,
    Checked: true,
  }).populate({
    path: "PaymentID",
    select: "PaymentRndID PaymentDate",
  });
  if (!payment) {
    throw new CustomError("Төлбөрийн мэдээлэл олдсонгүй", 404);
  }
  return res.status(200).json({
    success: true,
    payInfo: payment,
  });
});

exports.createPay = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user);
  if (!customer) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }

  const paymentOrders = await Order.find({
    CustomerId: req.user,
    Checked: false,
  });

  if (!paymentOrders.length || paymentOrders.length == 0) {
    throw new CustomError("Таны захиалга хоосон байна", 401);
  }

  let total = paymentOrders.reduce((sum, order) => sum + order.Price, 0);
  const paymentRndID = random(6) + "-" + customer.phone;

  const payment = await Payment.create({
    CustomerId: customer.id,
    TotalPrice: total,
    PaymentRndID: paymentRndID,
  });

  await Order.updateMany(
    { CustomerId: req.user, Checked: false },
    { Checked: true, PaymentID: payment.id }
  );

  return res.status(200).json({
    success: true,
    payInfo: payment,
  });
});
