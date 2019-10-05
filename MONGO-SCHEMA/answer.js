const { Schema, model } = require('mongoose')

// Journal Entry
const Entry = new Schema({
    debit: { type: Number, required: true },
    credit: { type: Number, required: true }
})

// Jornal
const Journal = new Schema({
    accounts: [String],
    trueAnswer: { type: Map, of: Entry, required: true }
})

Journal.pre('save', function (next) {
    this.accounts = []
    let debit = 0
    let credit = 0
    for (let [key, value] of this.trueAnswer) {
        this.accounts.push(key)
        debit = debit + value.debit
        credit = credit + value.credit
    }

    if (debit !== credit) throw Error("DEBIT & CREDIT should balance")
    next()
})

// Choice
const Choice = new Schema({
    options: [String],
    trueAnswer: { type: Map, of: Boolean, required: true }
})

Choice.pre('save', function (next) {
    const parent = this.parent()
    const { single } = parent
    let trueTotal = 0

    this.options = []
    for (let [key, value] of this.trueAnswer) {
        this.options.push(key)
        if (value) trueTotal++
    }

    if (single && trueTotal > 1) {
        throw Error("SINGLE cannot have more than one true answer")
    }

    next()
})

const Answer = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    journal: Journal,
    multi: Choice,
    single: Choice,
    word: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Page"
    }
})

Answer.pre('validate', function (next) {
    const answerType = ['journal', 'multi', 'single', 'word']
    let totalAnswer = 0

    answerType.forEach(type => {
        if (this[type]) totalAnswer++
    })

    if (totalAnswer !== 1) throw Error("ANSWER can only have one type")

    next()
})

Answer.pre('save', function (next) {
    const { journal, multi, single, word } = this
    if (!journal && !multi && !single && !word) {
        throw Error("Answer cannot be null")
    }
    next()
})

// Answer.post('save', async function (doc) {
//     const parent = await Page.findById(doc.parent)
//     parent.pages.push(doc._id)
//     const savedParent = await parent.save()
//     console.log(savedParent)
// })

module.exports = model('Answer', Answer)