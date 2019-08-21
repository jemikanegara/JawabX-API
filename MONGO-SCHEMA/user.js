const { Schema, model } = require('mongoose');

const User = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    module: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
}, { timestamps: true })

module.exports = model('User', User)