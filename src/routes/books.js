const express = require("express");
const { defend, authorizer } = require("../middleware/defend");
const {
  getBook,
  getBooks,
  updateBooks,
  createBook,
  deleteBook,
  uploadBookPhoto,
} = require("../controller/books");
//gadnaas oor router huleej avna mergeParams: true
const router = express.Router();

//"/api/v1/categories"
router
  .route("/")
  .get(getBooks)
  .post(defend, authorizer("operator"), createBook);
router.route("/:id/photo").put(defend, authorizer("operator"), uploadBookPhoto);
router
  .route("/:id")
  .get(getBook)
  .put(defend, authorizer("operator"), updateBooks)
  .delete(deleteBook);
module.exports = router;
