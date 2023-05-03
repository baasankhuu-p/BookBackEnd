const mongoose = require("mongoose");
const datenow = require("../utils/dateNow");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Категорийн нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxLength: [50, "Катгорийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой"],
    },
    description: {
      type: String,
      required: [true, "Категорийн тайлбарыг заавал оруулна уу"],
      maxlength: [
        500,
        "Катгорийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.png",
    },
    createdAt: {
      type: Date,
      default: datenow(new Date()),
    },
    CreateUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
    },
    UpdateUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.pre("remove", async function (next) {
  console.log("remove...");
  await this.model("Book").deleteMany({ category: this._id });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
