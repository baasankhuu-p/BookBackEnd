const express = require("express");
const { defend, authorizer, customerdefend } = require("../middleware/defend");
const {
  getDeliveries,
  createdelivery,
  notDeliveries,
  getDelivery,
} = require("../controller/deliveryd");
const router = express.Router();
router.route("/all").get(defend, authorizer("operator"), getDeliveries);
router
  .route("/")
  .get(customerdefend, getDelivery)
  .post(defend, authorizer("operator"), createdelivery);
router.route("/not").get(defend, authorizer("operator"), notDeliveries);

module.exports = router;
