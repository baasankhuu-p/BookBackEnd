const mongoose = require("mongoose");
const datenow = require("../utils/dateNow");
const Delivery = new mongoose.Schema(
  {
    CustomerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    DeliveryDate: {
      type: Date,
      default: datenow(new Date()),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
module.exports = mongoose.model("Delivery", Delivery);
