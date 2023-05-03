const express = require('express')
const { defend, authorizer } = require('../middleware/defend')
const {
  getCategory,
  getCategories,
  createCategory,
  UploadCategoryPhoto,
  updateCategory,
  deleteCategory
} = require('../controller/categories')

const { getCategoryBooks } = require('../controller/books')

const router = express.Router()
router
  .route('/')
  .get(getCategories)
  .post(defend, authorizer('operator'), createCategory)

router
  .route('/:id')
  .get(getCategory)
  .put(defend, authorizer('operator'), updateCategory)
  .delete(defend, authorizer('operator'), deleteCategory)
router
  .route('/:id/photo')
  .put(defend, authorizer('operator'), UploadCategoryPhoto)
router.route('/:categoryId/books').get(getCategoryBooks)
module.exports = router
