const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const datenow = require("../utils/dateNow");
const customerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, ["нэрээ оруулна уу"]],
    minLength: [3, "Үйлчлүүлэгчийн нэр хэт богино байна"],
    maxLength: [15, "Үйлчлүүлэгчийн нэр хэт урт байна"],
    trim: true,
  },
  lname: {
    type: String,
    required: [true, ["Эцгийн нэрийг оруулна уу"]],
    minLength: [3, "Үйлчлүүлэгчийн нэр хэт богино байна"],
    maxLength: [15, "Үйлчлүүлэгчийн нэр хэт урт байна"],
    trim: true,
  },
  email: {
    type: String,
    maxLength: [50, "Үйлчлүүлэгчийн имейл хэт урт байна"],
    required: [true, "Хэрэглэгч мэйл ээ оруулна уу"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Мейл буруу байна",
    ],
    unique: true,
  },
  phone: {
    type: Number,
    minLength: [8, "Та дугаараа зөв оруулна уу"],
    required: [true, "Дугаар оруулаагүй байна"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: [8, "Таны нууц үг хэт богино байна"],
    required: [true, "Та нууц үгээ оруулна уу"],
    select: false,
  },
  address: {
    type: String,
    minLength: [10, "Хаягаа зөв оруулна уу"],
  },
  CreatedDate: {
    type: Date,
    default: datenow(new Date()),
  },
});
customerSchema.pre("save", async function () {
  //passiig oilgomjgui blgj oorchlnoo ingsneer hack-s baga zrg secure hgdj ognoo
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//JWT
customerSchema.methods.getJsonWebToken = function () {
  const token = JWT.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_BOOK_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};
//
customerSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

customerSchema.pre("remove", async function (next) {
  console.log("Book in Comments remove...");
  await this.model("Comment").deleteMany({ CustomerId: this._id });
  next();
});
//User login pass check
customerSchema.methods.CheckPass = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};
module.exports = mongoose.model("Customer", customerSchema);
