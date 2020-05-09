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

module.exports = mongoose.model("Step", StepSchema)