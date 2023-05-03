const mongoose = require("mongoose");
const datenow = require("../utils/dateNow");
const BookSchema = new mongoose.Schema(
  {
    bookname: {
      type: String,
      required: [true, "Номын нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxLength: [50, "номын нэрний урт дээд тал нь 50 тэмдэгт байх ёстой"],
    },
    author: {
      type: String,
      required: [true, "зохиогчийн нэрийг оруулна уу"],
      trim: true,
      maxLength: [
        25,
        "зохиогчийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой",
      ],
    },
    content: {
      type: String,
      required: [true, "Номын тайлбарыг оруулна уу"],
      trim: true,
      maxLength: [1000, "Тайлбарын урт дээд тал нь 1000 тэмдэгт байх ёстой"],
    },
    pages: {
      type: Number,
      required: [true, "Хуудасны тоог оруулна уу"],
      trim: true,
    },
    photo: {
      type: String,
      default: "no-photo.png",
    },
    averageRating: {
      type: Number,
      min: [0, "Рэйтинг хамгийн багадаа 0 байх ёстой"],
      max: [5, "Рэйтинг хамгийн ихдээ 5 байх ёстой"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Номын үнийг оруулна уу"],
      min: [3000, "Номны үнэ хамгийн багадаа 3000 байх ёстой"],
    },
    count: {
      type: Number,
      required: [true, "номын тоог оруулна уу"],
    },
    salePrice: {
      type: Number,
      maxLength: [
        0.9,
        "Хямдрал хамгийн ихдээ 90%-ийн хямдрал зарлах боломжтой",
      ],
      minLength: [0, "Хямдралын утга сөрөг(-) байж болохгүй"],
      default: 0,
    },
    entryDate: {
      type: Date,
      default: datenow(new Date()),
    },
    createdAt: {
      type: Date,
      default: datenow(new Date()),
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    CreateUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "Manage",
    },
    UpdateUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "Manage",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
BookSchema.pre("remove", async function (next) {
  await this.model("Comment").deleteMany({ BookID: this._id });
  next();
});
module.exports = mongoose.model("Book", BookSchema);
