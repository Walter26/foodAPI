var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");

var app = express();

// mongoose setup
mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
  console.log("success Connected to database");
})
.catch((err) => {
  debug(err);
  process.exit(1);
});


// routes definitions

module.exports = app;