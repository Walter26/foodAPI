const mongoose = require('mongoose'), Schema = mongoose.Schema

var ListSchema = mongoose.Schema({
    autor : {
        type: String,
        required: true
    },
    name: String,
    desc: String,
    elements: [{
        type: Schema.Types.ObjectId,
        ref: "ListElement",
        required: true
    }]
}, {timestamps: false})

module.exports = mongoose.model("List", ListSchema)