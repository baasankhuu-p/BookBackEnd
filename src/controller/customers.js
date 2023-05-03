const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/CustomError");
const Customers = require("../Models/customers");
const Manage = require("../Models/manage");
const paginate = require("../utils/paginate");
const { findOne } = require("../Models/customers");

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const select = req.query.select || {};
  const sort = req.query.sort || {};
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  //pagenation

  const pagenation = await paginate(page, limit, Customers);
  const customer = await Customers.find(req.query, select)
    .sort(sort)
    .skip(pagenation.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    customer,
    pagenation,
  });
});

exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customers.findById(req.params.id);
  if (!customer) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай хэрэглэгч олдсонгүй ..`,
      400
    );
  }
  res.status(200).json({
    success: true,
    data: customer,
  });
});

exports.updateCustomers = asyncHandler(async (req, res, next) => {
  const customer = await Customers.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Шинэчлэгдсэн мэдээллийг өгнө
    runValidators: true, //Баз үүсгэж байхдаа гаргаж байасн шалгалтыг бас шалгаж өгөөрэй гэж хэлж өгнө,
  });
  if (!customer) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай хэрэглэгч олдсонгүй ..`,
      400
    );
  }
  res.status(200).json({
    success: true,
    data: customer,
  });
});
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  console.log(req);
  if (!req.user || !req.email) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }
  const customer = await Customers.findByIdAndUpdate(req.user, req.body, {
    new: true, //Шинэчлэгдсэн мэдээллийг өгнө
    runValidators: true, //Баз үүсгэж байхдаа гаргаж байасн шалгалтыг бас шалгаж өгөөрэй гэж хэлж өгнө,
  });
  if (!customer) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай хэрэглэгч олдсонгүй ..`,
      400
    );
  }
  res.status(200).json({
    success: true,
    data: customer,
  });
});
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customers.findById(req.params.id);
  if (!customer) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай хэрэглэгч олдсонгүй ..`,
      400
    );
  }
  customer.remove();
  res.status(200).json({
    success: true,
    data: customer,
  });
});

exports.loginCustomer = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("Имейл эсвэл нууц үгээ оруулна уу", 400);
  }
  const customers = await Customers.findOne({ email }).select("+password");
  if (!customers) {
    throw new CustomError("Имейл эсвэл нууц үг буруу байна", 400);
  }

  const ok = await customers.CheckPass(password);
  if (!ok) {
    throw new CustomError("Имейл эсвэл нууц үг буруу байна", 400);
  }
  res.status(200).json({
    success: true,
    token: customers.getJsonWebToken(),
    customers,
    login: true,
  });
});

exports.registerCustomer = asyncHandler(async (req, res, next) => {
  const manage = await Manage.find({ email: req.body.email });
  const customers = await Customers.find({ email: req.body.email });
  if (manage.length > 0 || customers.length > 0) {
    throw new CustomError("ийм мейлтэй хэрэглэгч бүртгүүлсэн байна", 404);
  }
  const customer = await Customers.create(req.body);
  return res.status(200).json({
    token: customer.getJsonWebToken(),
    success: true,
    customer,
  });
});
