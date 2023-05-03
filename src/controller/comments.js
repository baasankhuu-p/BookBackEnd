const asyncHandler = require('../middleware/asyncHandler')
const CustomError = require('../utils/CustomError')
const paginate = require('../utils/paginate')
const Comment = require('../Models/comments')
const Customer = require('../Models/customers')
const Book = require('../Models/books')
exports.getComments = asyncHandler(async (req, res, next) => {
  const select = req.query.select || {}
  const sort = req.query.sort || {}
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  ;['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el])
  const pagenation = await paginate(page, limit, Comment)
  const comment = await Comment.find(req.query, select)
    .populate({
      path: 'CustomerId',
      select: 'fname'
    })
    .populate({
      path: 'BookID',
      select: 'bookname'
    })
    .sort(sort)
    .skip(pagenation.start - 1)
    .limit(limit)
  res.status(200).json({
    success: true,
    comment,
    pagenation
  })
})

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.find({ BookID: req.params.id })
    .sort({ CommentDate: -1 })
    .populate({
      path: 'CustomerId',
      select: 'fname'
    })
    .populate({
      path: 'BookID',
      select: 'bookname'
    })
  res.status(200).json({
    success: true,
    comment
  })
})
exports.createComment = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user)
  if (!customer) {
    throw new CustomError('Та нэвтэрсний дараа сэтгэгдэл илгээх боломжтой', 404)
  }
  const book = await Book.findById(req.params.id)
  const commentData = req.body.comments
  const ratingData = req.body.rating
  if (!commentData) {
    throw new CustomError('Та сэтгэгдлээ бичээгүй байна', 400)
  }
  if (!ratingData) {
    throw new CustomError('Та үнэлгээ өгөөгүй байна', 400)
  }
  if (!req.params.id || !book) {
    throw new CustomError('Та номоо сонгох эсвэл тухайн ном байхгүй байна', 400)
  }
  const data = {
    Comment: commentData,
    CustomerId: customer.id,
    BookID: req.params.id,
    Rating: ratingData
  }
  const comment = await Comment.create(data)

  return res.status(200).json({
    success: true,
    comment
  })
})
exports.deleteComments = asyncHandler(async (req, res, next) => {
  if (!req.params.id || !req.body.customer) {
    throw new CustomError(
      'Та үйлчлүүлэгчийн болон номын дугаараа зөв оруулсан эсэхээ шалгана уу',
      404
    )
  }

  const comments = await Comment.find({
    BookID: req.params.id,
    CustomerId: req.body.customer
  })

  if (comments.length === 0) {
    throw new CustomError(
      `${req.body.customer}-ID тэй үйлчлүүлэгчийн коммент олдсонгүй`,
      401
    )
  }

  const { deletedCount } = await Comment.deleteMany({
    BookID: req.params.id,
    CustomerId: req.body.customer
  })

  res.status(200).json({
    success: true,
    data: `Амжилттай устгагдсан ${deletedCount}`
  })
})
