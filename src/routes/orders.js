const express = require("express");
const { customerdefend, defend, authorizer } = require("../middleware/defend");
const {
  getOrders,
  getOrder,
  createOrders,
  deleteIdOrder,
  getConfirmOrder,
} = require("../controller/orders");
const router = express.Router();
router.route("/all").get(defend, authorizer("operator"), getOrders);
router.route("/confirm").get(customerdefend, getConfirmOrder);
router.route("/:id").delete(customerdefend, deleteIdOrder);
router
  .route("/")
  .get(customerdefend, getOrder)
  .post(customerdefend, createOrders);
module.exports = router;
