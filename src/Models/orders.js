const mongoose = require("mongoose");
const datenow = require("../utils/dateNow");
const Orders = new mongoose.Schema(
  {
    Price: {
      type: Number,
      minLength: [2000, "Захиалга хийхэд ядаж 2000₮ худалдаа хийх ёстой"],
    },
    Delivere: {
      type: Boolean,
      default: false,
    },
    Checked: {
      type: Boolean,
      default: false,
    },
    OrderDate: {
      type: Date,
      default: datenow(new Date()),
    },
    CustomerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    PaymentID: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
    DeliverID: {
      type: mongoose.Schema.ObjectId,
      ref: "Delivery",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Order", Orders);
