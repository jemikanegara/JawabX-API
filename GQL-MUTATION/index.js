const models = require('../FUNCTIONS/models')
const { user: User, module: Module, page: Page, answer: Answer, tried: Tried } = models
const modifyFunction = require('../FUNCTIONS/modifyFunction')
const deleteFunction = require('../FUNCTIONS/deleteFunction')

module.exports = {
    register: async (_, { email, password, phone }, ctx) => {
        if (!email && !phone) throw Error("Must provide email or phone number")
        if (!password) throw Error("Invalid password format")
        const newUser = new User({
            email,
            password,
            phone
        })
        return await newUser.save().then(res => res.id)
    },

    login: async (_, { email, password, phone }, ctx) => {
        if (!email && !phone) throw Error("Must provide email or phone number")
        if (!password) throw Error("Invalid password format")

        let userData;

        if (!phone && email) userData = await User.findOne({ email })
        else if (phone) userData = await User.findOne({ phone })

        if (!userData) throw Error("No Access")
    },

    modifyModule: async (model = "modules", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded }),

    deleteModule: async (_, { data }, { decoded }) =>
        await deleteFunction(Module, { data }, { decoded }),

    modifyPage: async (model = "pages", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded }),

    deletePage: async (_, { data }, { decoded }) =>
        await deleteFunction(Page, { data }, { decoded })
}