const express = require("express");
const { defend, customerdefend, authorizer } = require("../middleware/defend");
const {
  getCustomer,
  getCustomers,
  loginCustomer,
  registerCustomer,
  updateCustomers,
  deleteCustomer,
  updateCustomer,
} = require("../controller/customers");
const router = express.Router();
router
  .route("/")
  .get(defend, authorizer("admin"), getCustomers)
  .post(defend, authorizer("admin"), registerCustomer)
  .put(customerdefend, updateCustomer);
router.route("/register").post(registerCustomer);
router.route("/login").post(loginCustomer);
router
  .route("/:id")
  .get(customerdefend, getCustomer)
  .put(defend, authorizer("admin"), updateCustomers)
  .delete(defend, authorizer("admin"), deleteCustomer);
module.exports = router;
