const { Schema, model } = require('mongoose')

const Page = new Schema({
    explanation: String,
    type: {
        type: String,
        enum: ['CONCEPT', 'PRACTICE']
    },
    user: Schema.Types.ObjectId,
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }]
})

module.exports = model('Page', Page)