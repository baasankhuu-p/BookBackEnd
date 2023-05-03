const express = require("express");
const { customerdefend, defend, authorizer } = require("../middleware/defend");
const { getPays, getPay, createPay } = require("../controller/payment");
const router = express.Router();
router.route("/all").get(defend, authorizer("operator", "admin"), getPays);
router.route("/").get(customerdefend, getPay).post(customerdefend, createPay);
module.exports = router;
