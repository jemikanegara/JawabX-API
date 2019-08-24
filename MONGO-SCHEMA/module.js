const { Schema, model } = require('mongoose')

const Image = new Schema({
    small: {
        type: String,
        required: true
    },
    medium: {
        type: String,
        required: true
    },
    original: {
        type: String,
        required: true
    }
}, { _id: false })

const Module = new Schema({
    type: {
        type: String,
        enum: ['LEARN', 'EXERCISE', 'TEST'],
        required: true
    },
    images: {
        type: [{ type: Image }],
        validate: {
            validator: (val) => { return val.length > 0 },
            message: (props) => `${props.value} length cannot be empty`
        }
    },
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