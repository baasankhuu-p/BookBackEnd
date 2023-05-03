const express = require("express");
const fileUpload = require("express-fileupload");
var cors = require("cors");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const connectDB = require("./src/config/db");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: ".env" });

var morgan = require("morgan");
const LogServer = require("./src/middleware/LogServer");
const ErrorHandler = require("./src/middleware/error.js");
const colors = require("colors");

// Router оруулж ирэх
const categoriesRoutes = require("./src/routes/categories");
const bookRoutes = require("./src/routes/books");
const manageRoutes = require("./src/routes/manage");
const customerRoutes = require("./src/routes/customers");
const orderRoutes = require("./src/routes/orders");
const payRoutes = require("./src/routes/payment");
const deliverRoutes = require("./src/routes/deliveryd");
const commentsRoutes = require("./src/routes/comments");
const app = express();
app.use(cors());
connectDB();
// Log bichij bui baidal
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

//Body Parser - Энэ нь шинээр req ирхэд express.н json-д өгөх гэж
app.use(express.json());
app.use(fileUpload());
app.use(LogServer);
app.use(express.static("public"));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/categories", categoriesRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/manage", manageRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", payRoutes);
app.use("/api/delivery", deliverRoutes);
app.use("/api/comment", commentsRoutes);
//err middleware
app.use(ErrorHandler);
const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

//process.on Event
//unhandledRejection - Алдааны Event
//Universal err
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
