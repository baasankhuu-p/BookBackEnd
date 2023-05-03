const mongoose = require("mongoose");
const datenow = require("../utils/dateNow");
const Comment = new mongoose.Schema(
  {
    CustomerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    BookID: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    Comment: {
      type: String,
      minLength: [5, "Коммент нь хамгийн багадаа 5 темдэгтээс бүрдэнэ "],
    },
    CommentDate: {
      type: Date,
      default: datenow(new Date()),
    },
    Rating: {
      type: Number,
      min: [0, "Рэйтинг хамгийн багадаа 0 байх ёстой"],
      max: [5, "Рэйтинг хамгийн ихдээ 5 байх ёстой"],
      default: 0,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
Comment.statics.computeCategoryAverageRating = async function (ratId) {
  const obj = await this.aggregate([
    { $match: { BookID: ratId } },
    { $group: { _id: "$BookID", avgRate: { $avg: "$Rating" } } },
  ]);
  let avgRating = null;

  if (obj.length > 0) avgRating = obj[0].avgRate;

  await this.model("Book").findByIdAndUpdate(ratId, {
    averageRating: avgRating,
  });
  return obj;
};

Comment.post("save", function () {
  this.constructor.computeCategoryAverageRating(this.BookID);
});

Comment.post("remove", function () {
  this.constructor.computeCategoryAverageRating(this.BookID);
});
module.exports = mongoose.model("Comment", Comment);
