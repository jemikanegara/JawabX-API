const { Schema, model } = require('mongoose')

const Answer = new Schema({
    type: {
        type: String,
        enum: ['JOURNAL', 'MULTI', 'SINGLE', 'WORD'],
        required: true
    },
    user: { type: Schema.Types.ObjectId, required: true },
    answer: {}
})

module.exports = model('Answer', Answer)