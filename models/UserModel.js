const mongoose = require('mongoose'), Schema = mongoose.Schema

var UserSchema = Schema({
    googleID: {
        type: String,
        unique: true
    },
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
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photoUri: String,
    lists: [{
        type: Schema.Types.ObjectId,
        ref: "List"
    }]
}, {timestamps: false})

module.exports = mongoose.model("User", UserSchema)