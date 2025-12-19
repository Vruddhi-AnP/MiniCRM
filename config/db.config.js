const path = require("path");

module.exports = {
  DB_FILE: process.env.DB_FILE || path.join(__dirname, "../data/apw.sqlite")
};

