const mongoose = require('mongoose'), Schema = mongoose.Schema

var StepSchema = mongoose.Schema({
    order: {
        type: Int16Array,
        required: true
    },
    step: {
        type: Text,
        required: true
    }
}, {timestamps: false})

var IngredientSchema = mongoose.Schema({
    ingredient: {
        type: String,
        required: true
    },
    meassure: String
}, {timestamps: false})

var RecipeSchema = Schema({
    autor : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: String,
    recipeType: [String],
    steps: [StepSchema],
    ingredients: [IngredientSchema],
    privacy: {
        type: Boolean,
        required: true
    },
    videoURL: String,
    imageURL: String
}, {timestamps: false});

module.exports = mongoose.model("Recipe", RecipeSchema)