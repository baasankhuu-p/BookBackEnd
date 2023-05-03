const Books = require("../Models/books");
const Category = require("../Models/categories");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const paginate = require("../utils/paginate");
//api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  const select = req.query.select || {};
  const sort = req.query.sort || { createdAt: -1 };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 500;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagenation = await paginate(page, limit, Books);
  //deer ajilj ehelsn query-g huleegd duushaar doosh huselt shidne
  const books = await Books.find(req.query, select)
    .populate({
      path: "category",
      select: "name averageRating",
    })
    .sort(sort)
    .skip(pagenation.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagenation,
  });
});

//api/v1/categories/:categoryId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const select = req.query.select || {};
  const sort = req.query.sort || {};
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  //pagenation
  const pagenation = await paginate(page, limit, Books);
  //deer ajilj ehelsn query-g huleegd duushaar doosh huselt shidne
  const books = await Books.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .populate({
      path: "category",
      select: "name averageRating",
    })
    .sort(sort)
    .skip(pagenation.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagenation,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Books.findById(req.params.id);
  if (!book) {
    throw new CustomError(`${req.params.id}-ийм ID-тай ном олдсонгүй ..`, 400);
  }
  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBooks = asyncHandler(async (req, res, next) => {
  const book = await Books.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //Шинэчлэгдсэн мэдээллийг өгнө
    runValidators: true, //Баз үүсгэж байхдаа гаргаж байасн шалгалтыг бас шалгаж өгөөрэй гэж хэлж өгнө,
  });
  if (!book) {
    throw new CustomError(`${req.params.id}-ийм ID-тай ном олдсонгүй ..`, 400);
  }
  book.UpdateUserId = req.user;
  book.save();
  //defend turuulj ajilsnii daraa user-n id oldh yum
  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Books.findById(req.params.id);
  if (!book) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,
      400
    );
  }
  book.remove();
  res.status(200).json({
    success: true,
    data: book,
  });
});
exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    throw new CustomError(
      `${req.body.category}-ийм ID-тай Категори олдсонгүй ..`,
      400
    );
  }
  const book = await Books.create(req.body);
  book.CreateUserId = req.user;
  book.save();
  return res.status(200).json({
    success: true,
    data: book,
  });
});

//file upload api
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Books.findById(req.params.id);
  if (!book) {
    throw new CustomError(
      `${req.params.id}-ийм ID-тай Категори олдсонгүй ..`,
      400
    );
  }
  const file = req.files.file;
  //file type check
  if (!file.mimetype.startsWith("image")) {
    throw new CustomError(`Та зураг оруулна уу ..`, 400);
  }
  if (file.size > process.env.IMAGE_SIZE) {
    throw new CustomError(`Таны зурагны хэмжээ 20mb хэтэрч болохгүй ..`, 400);
  }
  file.name = "photo_" + req.params.id + path.parse(file.name).ext;
  file.mv(`${process.env.BOOK_PHOTO_FOLDER_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new CustomError(`оруулах явцад алдаа гарлаа ..`, 400);
    }
  });
  book.photo = file.name;
  book.UpdateUserId = req.user;
  book.save();
  return res.status(200).json({
    success: true,
    photo: file.name,
  });
});
