const asyncHandler = require("../middleware/asyncHandler");
const CustomError = require("../utils/CustomError");
const paginate = require("../utils/paginate");
const Customer = require("../Models/customers");
const Book = require("../Models/books");
const Order = require("../Models/orders");
const Order2Book = require("../Models/o2b");
exports.getOrders = asyncHandler(async (req, res, next) => {
  // Хэрэглэгчийн ID-аар захиалгуудыг хайж авах
  const orders = await Order.find({
    CustomerId: req.body.customer,
  })
    .populate({
      path: "CustomerId",
      select: "fname lname phone address",
    })
    .sort({ OrderDate: -1 });

  // Захиалгууд байхгүй бол алдаа гаргана
  if (!orders || orders.length == 0) {
    throw new CustomError(
      `${req.body.customer} үйлчлүүлэгчид захиалга байхгүй байна.`,
      404
    );
  }

  // Захиалгуудын мэдээллийг хадгалах массив
  let data = [];

  // Захиалгууд дээрээ үйлчилж байгаа номуудын мэдээллийг авах
  for (const order of orders) {
    // Захиалгуудын номуудын ID-нуудыг авах
    const order2books = await Order2Book.find({ OrderID: order.id }).populate({
      path: "BookId",
      select: "bookname author photo price salePrice",
    });
    const row = {
      OrderID: order.id,
      CustomerId: order.CustomerId,
      BookId: order2books[0].BookId,
      Quantity: order2books[0].Quantity,
      TotalPrice: order.Price,
      OrderDate: order.OrderDate,
    };
    data.push(row);
  }

  // Хүснэгтэнд хадгалсан захиалгуудын мэдээллүүдийг хэвлэх
  res.status(200).json({
    success: true,
    data,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  var data = [];
  if (!req.user || !req.email) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }
  const orders = await Order.find({
    CustomerId: req.user,
    Checked: false,
    Delivere: false,
  });
  if (!orders || orders.length == 0) {
    throw new CustomError(`Та захиалга хийгээгүй байна`, 400);
  }

  for (const order of orders) {
    const o2b = await Order2Book.find({ OrderID: order.id }).populate("BookId");
    o2b.forEach((item) => {
      const row = {
        OrderID: order.id,
        Book: item.BookId,
        Quantity: item.Quantity,
        OrderDate: order.OrderDate,
      };
      data.push(row);
    });
  }
  res.status(200).json({
    success: true,
    data,
  });
});

exports.getConfirmOrder = asyncHandler(async (req, res, next) => {
  var OrderData = [];
  var data = [];

  if (!req.user || !req.email) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }
  const orders = await Order.find({
    CustomerId: req.user,
    Checked: true,
    Delivere: false,
  })
    .populate("PaymentID")
    .sort({ OrderDate: -1 });
  if (!orders || orders.length == 0) {
    throw new CustomError(`Танд төлбөр төлсөн мэдээлэл байхгүй`, 400);
  }
  for (const order of orders) {
    const o2b = await Order2Book.find({ OrderID: order.id }).populate({
      path: "BookId",
      select: "photo",
    });
    o2b.forEach((item) => {
      const row = {
        Book: item.BookId,
        Quantity: item.Quantity,
        OrderDate: order.OrderDate,
      };
      data.push(row);
    });
    OrderData.push({
      OrderID: order.id,
      Payment: order.PaymentID,
      OrderData: data,
    });
    data = [];
  }
  res.status(200).json({
    success: true,
    data: OrderData,
  });
});
exports.createOrders = asyncHandler(async (req, res, next) => {
  //BookID, CustomerID, count
  const userFind = await Customer.findById(req.user);
  if (!userFind) {
    throw new CustomError(
      `${req.user}-ийм ID-тай үйчлүүлэгч олдсонгүй ..`,
      400
    );
  }
  const { BookID, quantity } = req.body;
  if (!BookID || !quantity) {
    throw new CustomError(`Та авах ном болон хэмжээгээ оруулна уу ..`, 400);
  }
  const book = await Book.findById(BookID);
  if (!book) {
    throw new CustomError(`${req.user}-ийм ID-тай ном олдсонгүй ..`, 400);
  }
  if (quantity > book.count) {
    throw new CustomError(
      `Та энэ номноос хамгийн ихдээ ${book.count} захиалах боломжтой байна`,
      400
    );
  }
  //хэрвээ захиалга байвал order хүснэгтэнд update байхгүй бол insert хийнэ. O2B бүх мэдээллийг хадгална
  const orderCheck = await Order.find({ Checked: false });
  const Quantity = quantity * (book.price - book.price * book.salePrice);
  var orderObject = {},
    o2bObject = {};
  var order = {};
  if (!orderCheck || orderCheck.length == 0) {
    orderObject = {
      Price: Quantity,
      CustomerId: req.user,
    };
    order = await Order.create(orderObject);
  } else {
    order = await Order.findOneAndUpdate(
      { Checked: false },
      { $inc: { Price: Quantity } }
    );
  }
  o2bObject = {
    OrderID: order.id,
    BookId: BookID,
    Quantity: quantity,
  };
  var order2book = await Order2Book.find({
    OrderID: o2bObject.OrderID,
    BookId: o2bObject.BookId,
  });
  var data = {};
  //Хэрвээ Захиалга дотор уг ном нь байвал тоог нэмэх
  if (order2book.length > 0) {
    order2book = await Order2Book.findOneAndUpdate(
      {
        OrderID: o2bObject.OrderID,
        BookId: o2bObject.BookId,
      },
      { $inc: { Quantity: quantity } }
    );
    data = order2book;
    data.Quantity = data.Quantity + parseInt(quantity);
  }
  //Хэрвээ Захиалга дотор уг ном нь байхгүй бол шинээр захиалгад бүртгэх
  else {
    order2book = await Order2Book.create(o2bObject);
    data = order2book;
  }
  book.count -= quantity;
  book.save();
  return res.status(200).json({
    success: true,
    order: {
      data,
    },
  });
});
exports.deleteIdOrder = asyncHandler(async (req, res, next) => {
  const { user, email } = req;
  const BookID = req.params.id;
  if (!user || !email) {
    throw new CustomError("Та үйлчлэгчийн эрхээр нэвтрэх ёстой", 401);
  }

  if (!BookID) {
    throw new CustomError(`Та захиалгаас устгах номоо оруулна уу`, 400);
  }

  const order = await Order.findOne({ Checked: false });
  if (!order || order.lenght == 0) {
    throw new CustomError("Танд захиалсан ном байхгүй байна", 404);
  }
  const order2Book = await Order2Book.findOne({
    OrderID: order.id,
    BookId: BookID,
  }).populate({
    path: "BookId",
    select: "bookname author content price",
  });
  if (!order2Book || order2Book.length == 0) {
    throw new CustomError("Танд захиалсан ном байхгүй байна", 404);
  }
  const updateBook = await Book.findByIdAndUpdate(BookID, {
    $inc: { count: order2Book.Quantity },
  });
  await Order.findByIdAndUpdate(order.id, {
    $inc: {
      Price: -(
        order2Book.Quantity *
        (updateBook.price - updateBook.price * updateBook.salePrice)
      ),
    },
  });

  await order2Book.remove();
  res.status(200).json({
    success: true,
    order2Book,
  });
});
