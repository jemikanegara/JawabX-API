const { Schema, model } = require('mongoose')

const Module = new Schema({
    type: {
        type: String,
        enum: ['LEARN', 'EXERCISE', 'TEST']
    },
    thumbnail: String,
    title: String,
    description: String,
    user: Schema.Types.ObjectId,
    pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }]
})

module.exports = model('Module', Module)