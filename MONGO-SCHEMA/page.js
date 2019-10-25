const { Schema, model } = require('mongoose')
const Module = require('./module')

const Page = new Schema({
    explanation: { type: String, required: true },
    type: {
        type: String,
        enum: ['CONCEPT', 'PRACTICE'],
        required: true
    },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Module"
    }
})

// Page.post('save', async function (doc) {
//     const parent = await Module.findById(doc.parent)
//     parent.pages.push(doc._id)
//     const savedParent = await parent.save()
//     console.log(savedParent)
// })

module.exports = model('Page', Page)