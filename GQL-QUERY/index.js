const books = require('../GQL-DUMMY/books')
const User = require('../MONGO-SCHEMA/user')
const Module = require('../MONGO-SCHEMA/module')
const Page = require('../MONGO-SCHEMA/page')
const Answer = require('../MONGO-SCHEMA/answer')

const Query = {
    user: async (_, { _id }, ctx) => await User.findById(_id).select('module').populate('module'),
    modules: async (_, args, ctx) => await Module.find().select('-pages').populate('user'),
    module: async (_, { _id }, ctx) => await Module.findById(_id).populate('user').populate({ path: 'pages', populate: { path: 'answers' } }),
    page: async (_, { _id, select }, ctx) => await Page.findById(_id).populate({ path: 'answers', select: `-journal.trueAnswer -single.trueAnswer -multi.trueAnswer ${select ? select : ""}` }),
    solution: async (_, { _id }, ctx) => await Answer.findById(_id)
}

module.exports = Query