var mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    },
})

module.exports = mongoose.model('Client', clientSchema)