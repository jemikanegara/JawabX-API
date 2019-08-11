const User = require('../MONGO-SCHEMA/user')
const Module = require('../MONGO-SCHEMA/module')
const Page = require('../MONGO-SCHEMA/page')
const Answer = require('../MONGO-SCHEMA/answer')
const Tried = require('../MONGO-SCHEMA/tried')

const models = {
    user: User,
    module: Module,
    page: Page,
    answer: Answer,
    tried: Tried
}

module.exports = models