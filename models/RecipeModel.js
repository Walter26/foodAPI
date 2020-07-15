const mongoose = require('mongoose'), Schema = mongoose.Schema

var RecipeSchema = Schema({
    author : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: String,
    recipeType: [String],
    steps: [String],
    ingredients: [String],
    privacy: {
        type: Boolean,
        required: true
    },
    recipeImage: String
}, {timestamps: false})

module.exports = mongoose.model("Recipe", RecipeSchema)