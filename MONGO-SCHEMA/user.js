const { Schema, model } = require('mongoose');

const User = new Schema({
    username: String,
    email: String,
    phone: String,
    password: String,
    module: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
})

module.exports = model('User', User)