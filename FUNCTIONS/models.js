const User = require('../MONGO-SCHEMA/user')
const Module = require('../MONGO-SCHEMA/module')
const Page = require('../MONGO-SCHEMA/page')
const Answer = require('../MONGO-SCHEMA/answer')
const Tried = require('../MONGO-SCHEMA/tried')

const models = {
    user: {
        dbParent: null,
        dbModel: User
    },
    module: {
        dbParent: null,
        dbModel: Module
    },
    page: {
        dbParent: [Module],
        dbModel: Page
    },
    answer: {
        dbParent: Page,
        dbModel: Answer
    },
    tried: {
        dbParent: null,
        dbModel: Tried
    }
}

module.exports = models