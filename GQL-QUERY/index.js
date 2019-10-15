const User = require('../MONGO-SCHEMA/user')
const Module = require('../MONGO-SCHEMA/module')
const Page = require('../MONGO-SCHEMA/page')
const Answer = require('../MONGO-SCHEMA/answer')
const perPage = 10

const Query = {
    // Single User - PROTOTYPE
    user: async (_, { _id }, ctx) => await User.findById(_id).select('module').populate('module'),

    // Multiple Modules - DONE
    modules: async (_, { user, text, type, lastModuleIndex }, ctx) => {

        let query = {}

        const idQuery = {
            _id: {
                $lt: lastModuleIndex
            }
        }

        const searchQuery = {
            $or: [
                { title: { $regex: text, $options: "i" } },
                { description: { $regex: text, $options: "i" } }
            ]
        }

        if (user) query = { ...query, user }

        if (type) query = lastModuleIndex ? { ...query, ...idQuery, type } : { ...query, type }

        if (text) query =
            lastModuleIndex ?
                { ...query, ...idQuery, ...searchQuery } : { ...query, ...searchQuery }

        if (!user && !type && !text) query = lastModuleIndex ? { ...idQuery } : {}

        return await Module.find(query)
            .lean()
            .sort({ _id: -1 })
            .limit(perPage)
            .select('-pages')
            .populate('user')
    },

    // Single Module - DONE
    module: async (_, { _id }, ctx) =>
        await Module
            .findById(_id)
            .populate('user')
            .populate({
                path: 'pages', populate: {
                    path: 'answers',
                    select: `-journal.trueAnswer -single.trueAnswer -multi.trueAnswer -word`
                }
            }),

    // Single Page - DONE
    page: async (_, { _id, select }, ctx) =>
        await Page
            .findById(_id)
            .populate({
                path: 'answers',
                select: `-journal.trueAnswer -single.trueAnswer -multi.trueAnswer -word ${select ? select : ""}`
            }),

    // Reveal Solution - DONE
    solution: async (_, { _id }, ctx) => await Answer.findById(_id)
}

module.exports = Query