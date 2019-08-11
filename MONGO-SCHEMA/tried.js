const { Schema, model } = require('mongoose')

const Tried = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        module: { type: Schema.Types.ObjectId, ref: 'Module' },
        page: Number,
    },
    { timestamps: true }
)

module.exports = model('Tried', Tried)