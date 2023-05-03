const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const datenow = require("../utils/dateNow");
const Manage = new mongoose.Schema({
  username: {
    type: String,
    required: [true, ["нэрээ оруулна уу"]],
    maxLength: [15, "нэр хэт урт байна"],
    minLength: [3, "нэр хэт богино байна"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "мэйл ээ оруулна уу"],
    maxLength: [50, "Имейл хэт урт байна"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Мейл буруу байна",
    ],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Дугаар оруулаагүй байна"],
    trim: true,
    unique: true,
  },
  roler: {
    type: String,
    required: [true, "Та удирдлагын эрхээ оруулна уу"],
    enum: ["operator"],
    default: "operator",
  },
  password: {
    type: String,
    minLength: [4, "Таны нууц үг хэт богино байна"],
    required: [true, "Та нууц үгээ оруулна уу"],
    select: false,
  },
  CreatedDate: {
    type: Date,
    default: datenow(new Date()),
  },
});

Manage.pre("save", async function () {
  //passiig oilgomjgui blgj oorchlnoo ingsneer hack-s baga zrg secure hgdj ognoo
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//JWT
Manage.methods.getJsonWebToken = function () {
  const token = JWT.sign(
    {
      id: this._id,
      roler: this.roler,
    },
    process.env.JWT_BOOK_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};
//User login pass check
Manage.methods.CheckPass = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};
module.exports = mongoose.model("Manage", Manage);
