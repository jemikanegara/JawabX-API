const books = require('../GQL-DUMMY/books')
const User = require('../MONGO-SCHEMA/user')
const Module = require('../MONGO-SCHEMA/module')

const Query = {
    user: async (_, { _id }, ctx) => await User.findById(_id).select('module').populate('module'),
    modules: async (_, args, ctx) => await Module.find().select('-pages'),
    module: async (_, { _id }, ctx) => await Module.findById(_id).select('-pages')
}

module.exports = Query