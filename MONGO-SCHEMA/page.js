const { Schema, model } = require('mongoose')

const Page = new Schema({
    explanation: { type: String, required: true },
    type: {
        type: String,
        enum: ['CONCEPT', 'PRACTICE'],
        required: true
    },
    user: { type: Schema.Types.ObjectId, required: true },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }]
})

module.exports = model('Page', Page)