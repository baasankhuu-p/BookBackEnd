const express = require('express')
const { defend, authorizer } = require('../middleware/defend')
const {
  getUser,
  getUsers,
  loginUser,
  updateUser,
  deleteUser,
  createUser
} = require('../controller/manage')
const router = express.Router()
router
  .route('/')
  .get(defend, authorizer('admin'), getUsers)
  .post(defend, authorizer('admin'), createUser)
router.route('/login').post(loginUser)
router
  .route('/:id')
  .get(defend, authorizer('admin', 'operator'), getUser)
  .put(defend, authorizer('admin'), updateUser)
  .delete(defend, authorizer('admin'), deleteUser)
module.exports = router
