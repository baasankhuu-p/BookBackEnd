const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
exports.defend = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError("Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна", 400);
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token || token === "null") {
    throw new CustomError("Токен байхгүй байна", 401);
  }
  const ObjToken = jwt.verify(token, process.env.JWT_BOOK_SECRET);
  req.user = ObjToken.id;
  req.role = ObjToken.roler;
  next();
});

exports.customerdefend = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError("Та нэвтрээгүй байна", 400);
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new CustomError("Токен байхгүй байна", 401);
  }
  const ObjToken = jwt.verify(token, process.env.JWT_BOOK_SECRET);
  req.user = ObjToken.id;
  if (!ObjToken.email) {
    throw new CustomError("Та үйлчлүүлэгчийн эрхээр нэвтэрнэ үү", 401);
  }
  req.email = ObjToken.email;
  next();
});

exports.authorizer = (...roler) => {
  return (req, res, next) => {
    if (!roler.includes(req.role)) {
      throw new CustomError(
        `Таны эрх [ ${
          req.role !== undefined ? req.role : "customer"
        } ] энэ үйлдлийг хийх боломжгүй`,
        401
      );
    }
    next();
  };
};
