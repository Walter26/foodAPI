const mongoose = require('mongoose'), Schema = mongoose.Schema

var RecipeTypeModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: false})

module.exports = mongoose.model("RecipeType", RecipeTypeModel)