const mongoose = require("mongoose");
const datenow = require("../utils/dateNow");
const Payment = new mongoose.Schema(
  {
    PaymentRndID: {
      type: String,
    },
    TotalPrice: {
      type: Number,
      required: true,
    },
    PaymentDate: {
      type: Date,
      default: datenow(new Date()),
    },
    CustomerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
module.exports = mongoose.model("Payment", Payment);
