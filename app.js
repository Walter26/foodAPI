//#region imports
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
//#endregion

//#region routes import
var UserRoute = require('./routes/UserRouter')
var ListRoute = require('./routes/ListRouter')
var RecipeRoute = require('./routes/RecipeRouter')
//#endregion

var app = express();

//#region middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to DB");
  console.log(__dirname)
})
.catch((err) => {
  debug(err);
  process.exit(1);
});
//#endregion

//#region router defs
app.use('/recipe', RecipeRoute)
app.use('/user', UserRoute)
app.use('/list', ListRoute)
app.use('/', (req, res, next) => {
  return res.status(200).json({status: "Welcome to food api"})
})
//#endregion

module.exports = app;