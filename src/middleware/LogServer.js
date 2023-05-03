const colors = require("colors");
const LogServer = (req, res, next) => {
  console.log(
    `Log: ${req.method} ${req.protocol}://${req.host}${req.originalUrl}`.blue
      .bold.underline
  );
  next();
};

module.exports = LogServer;
