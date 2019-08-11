const { Schema, model } = require('mongoose')

const Answer = new Schema({
    type: {
        type: String,
        enum: ['JOURNAL', 'MULTI', 'SINGLE', 'WORD']
    },
    user: Schema.Types.ObjectId,
    answer: {}
})

module.exports = model('Answer', Answer)