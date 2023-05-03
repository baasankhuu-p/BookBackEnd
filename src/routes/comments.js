const express = require("express");
const { customerdefend, defend, authorizer } = require("../middleware/defend");
const {
  getComments,
  getComment,
  createComment,
  deleteComments,
} = require("../controller/comments");
const router = express.Router();
router.route("/").get(getComments);
router
  .route("/:id")
  .get(getComment)
  .post(customerdefend, createComment)
  .delete(defend, authorizer("operator"), deleteComments);
module.exports = router;
