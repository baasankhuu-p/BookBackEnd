const mongoose = require("mongoose");
const o2b = new mongoose.Schema(
  {
    BookId: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    OrderID: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
      required: true,
    },
    Quantity: {
      type: Number,
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Order2Book", o2b);
