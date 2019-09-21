const { Schema, model } = require('mongoose')

const Answer = new Schema({
    type: {
        type: String,
        enum: ['JOURNAL', 'MULTI', 'SINGLE', 'WORD'],
        required: true
    },
    user: { type: Schema.Types.ObjectId, required: true },
    answer: {}
})

Answer.pre('save', function (next) {

    // Check for null
    if (!Array.isArray(this.answer) || this.answer.length < 1) throw Error("Answer cannot be empty")

    // Check for multiple answer for single and word type
    if (this.type === "SINGLE" || this.type === "WORD" && this.answer.length > 1) throw Error(`${this.type} cannot have more than one answer`)

    // Check for value inside answer
    this.answer.forEach(({ debit, credit, account, value }) => {

        // Journal Type must have 3 field
        // DEBIT, CREDIT, ACCOUNT
        if (this.type === "JOURNAL") {
            if (!debit || !credit || !account) {
                throw Error("Journal must have account, debit and credit value")
            }

            if (typeof debit !== 'number' || typeof credit !== 'number') throw Error("Debit and credit should be a number")
        }
        // Non Journal Type must have 'value' field
        else {
            if (!value) throw Error("Answer should have 'value' field")
        }
    })

    next()
})

module.exports = model('Answer', Answer)