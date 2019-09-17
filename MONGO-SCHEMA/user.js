const { Schema, model } = require('mongoose');

const User = new Schema({
    name: { type: String, required: true, minlength: 1 },
    username: { type: String, unique: true, sparse: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true, index: true },
    password: { type: String, required: true },
    module: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
}, { timestamps: true })

module.exports = model('User', User)