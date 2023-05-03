const ErrorHandler = (err, req, res, next) => {
  if (err.message.includes("Хаягаа зөв оруулна уу")) {
    err.message = "Хаягаа зөв оруулна уу";
  }
  if (err.name === "JsonWebTokenError" && err.message === "jwt malformed") {
    err.message = "Та нэвтрээгүй байна";
  }
  if (err.code) {
    err.message = "мэдээлэл давхцаж байна";
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
  next();
};
module.exports = ErrorHandler;
