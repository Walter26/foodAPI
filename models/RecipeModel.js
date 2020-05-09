const mongoose = require('mongoose'), Schema = mongoose.Schema

var RecipeSchema = Schema({
    title: {
        type: String,
        required: true
    },
    desc: String,
    recipe_type: [{
        type: Schema.Types.ObjectId,
        ref: "RecipeType",
        required: true
    }],
    steps: [{
        type: Schema.Types.ObjectId,
        ref: "Step",
        required: true
    }],
    ingredients: [{
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
    }],
    privacy: {
        type: Boolean,
        required: true
    },
    videoURL: String,
    imageURL: String
}, {timestamps: false});

module.exports = mongoose.model("Recipe", RecipeSchema)