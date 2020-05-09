const mongoose = require('mongoose'), Schema = mongoose.Schema
const Recipe = require('./RecipeModel')

var UserSchema = Schema({
    googleID: {
        type: String,
        required: true,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photoUri: {
        type: String,
        required: true,
        unique: true
    },
    lists: [{
        type: Schema.Types.ObjectId,
        ref: "List"
    }],
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    }]
}, {timestamps: false})

module.exports = mongoose.model("User", UserSchema)