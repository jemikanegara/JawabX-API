const User = require('../MONGO-SCHEMA/user')
const Module = require('../MONGO-SCHEMA/module')
const Page = require('../MONGO-SCHEMA/page')
const Answer = require('../MONGO-SCHEMA/answer')
const perPage = 10

const Query = {
    // Single User - PROTOTYPE
    user: async (_, { _id }, ctx) => await User.findById(_id).select('module').populate('module'),

    // Account
    account: async (_, args, { decoded }) => await User.findById(decoded._id).select('-password -module'),

    accountCheck: async (_, args, { decoded }) => {
        if (!decoded._id) throw Error("No access")

        let conditions = []

        for (let key in args) {
            if (args[key]) conditions.push({ [key]: args[key] })
        }

        const check = await User.findOne({
            $or: conditions
        }).select('-password -module')

        if (check) return false
        else return true
    },

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