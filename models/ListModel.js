const mongoose = require('mongoose'), Schema = mongoose.Schema

var ListElementSchema = mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    quantity: String
}, {timestamps: false})

var ListSchema = mongoose.Schema({
    autor : {
        type: String,
        required: true
    },
    name: String,
    desc: String,
    elements: [ListElementSchema]
}, {timestamps: false})

module.exports = mongoose.model("List", ListSchema)