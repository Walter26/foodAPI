const mongoose = require('mongoose'), Schema = mongoose.Schema

var ListElementSchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    quantity: String
}, {timestamps: false})

var ListSchema = mongoose.Schema({
    name: String,
    desc: String,
    listType: String,
    elements: [ListElementSchema]
}, {timestamps: false})

var UserSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userImage: String,
    lists: [ListSchema]
}, {timestamps: false})

module.exports = mongoose.model("User", UserSchema)