const mongoose = require('mongoose'), Schema = mongoose.Schema

var ListElementSchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    quantity: String
}, {timestamps: false})

module.exports = mongoose.model("ListElement", ListElementSchema)