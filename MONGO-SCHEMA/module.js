const { Schema, model } = require('mongoose')

const Module = new Schema({
    type: {
        type: String,
        enum: ['LEARN', 'EXERCISE', 'TEST'],
        required: true
    },
    thumbnail: { type: String, required: true },
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 100 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pages: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
        validate: {
            validator: (val) => { return val.length > 0 },
            message: (props) => `${props.value} length cannot be empty`
        }
    }
}, { timestamps: true })

module.exports = model('Module', Module)