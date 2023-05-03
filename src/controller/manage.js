const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/CustomError");
const Manage = require("../Models/manage");
const paginate = require("../utils/paginate");
const { findOne } = require("../Models/manage");

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("Имейл эсвэл нууц үгээ оруулна уу", 400);
  }
  const user = await Manage.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Имейл эсвэл нууц үг буруу байна", 400);
  }

  const ok = await user.CheckPass(password);
  if (!ok) {
    throw new CustomError("Имейл эсвэл нууц үг буруу байна", 400);
  }
  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
    login: true,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const select = req.query.select || {};

  const sort = req.query.sort || {};
  ["select", "sort"].forEach((el) => delete req.query[el]);
  const user = await Manage.find(req.query, select).sort(sort);
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await Manage.findById(req.params.id);
  if (!user) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай үйлчлүүлэгч олдсонгүй ..`,
      400
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await Manage.create(req.body);
  return res.status(200).json({
    token: user.getJsonWebToken(),
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await Manage.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Шинэчлэгдсэн мэдээллийг өгнө
    runValidators: true, //Баз үүсгэж байхдаа гаргаж байасн шалгалтыг бас шалгаж өгөөрэй гэж хэлж өгнө,
  });
  if (!user) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай үйчлүүлэгч олдсонгүй ..`,
      400
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await Manage.findById(req.params.id);
  if (!user) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай үйлчлүүлэгч олдсонгүй ..`,
      400
    );
  }
  user.remove();
  res.status(200).json({
    success: true,
    data: user,
  });
});
