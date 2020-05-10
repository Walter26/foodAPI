//#region imports
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
var morgan = require('morgan')
//#endregion

//#region routes import
var UserRoute = require('./routes/UserRouter')
//#endregion

var app = express();

//#region middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  debug(err);
  process.exit(1);
});
//#endregion

//#region router defs
app.use('/user', UserRoute)
//#endregion

module.exports = app;