const { Schema, model } = require('mongoose')

const Notif = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    }
})

module.exports = model('Notif', Notif)