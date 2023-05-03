const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const Category = require("./Models/categories");
const Book = require("./Models/books");
const Manage = require("./Models/manage");
const Customer = require("./Models/customers");
const Order = require("./Models/orders");
const Payment = require("./Models/payment");
const Delivered = require("./Models/deliveryd");
const Comments = require("./Models/comments");
const O2B = require("./Models/o2b");

dotenv.config({ path: "./config/config.env" });

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const categories = JSON.parse(
  fs.readFileSync(__dirname + "/data/categories.json", "utf-8")
);

const books = JSON.parse(
  fs.readFileSync(__dirname + "/data/book.json", "utf-8")
);

const manage = JSON.parse(
  fs.readFileSync(__dirname + "/data/manage.json", "utf-8")
);

const customers = JSON.parse(
  fs.readFileSync(__dirname + "/data/customer.json", "utf-8")
);
const importData = async () => {
  try {
    // await Manage.create(manage);
    await Category.create(categories);
    await Book.create(books);
    // await Customer.create(customers);
    console.log("Өгөгдлийг импортлолоо....".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Book.deleteMany();
    await Category.deleteMany();
    // await Manage.deleteMany();
    // await Customer.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    await Delivered.deleteMany();
    await Comments.deleteMany();
    await O2B.deleteMany();
    console.log("Өгөгдлийг бүгдийг устгалаа....".red.inverse);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
