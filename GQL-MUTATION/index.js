const models = require('../FUNCTIONS/models')
const {
    user: { dbModel: User },
    module: { dbModel: Module },
    page: { dbModel: Page },
    answer: { dbModel: Answer },
    tried: { dbModel: Tried }
} = models
const modifyFunction = require('../FUNCTIONS/modifyFunction')
const deleteFunction = require('../FUNCTIONS/deleteFunction')
const bcrypt = require('bcrypt')
const { generateToken } = require('../FUNCTIONS/tokenFunction')

module.exports = {
    register: async (_, { name, email, password, phone }) => {
        if (!email && !phone) throw Error("Must provide email or phone number")
        if (!password) throw Error("Invalid password format")
        if (name && name === "") throw Error("Name cannot be empty")

        password = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password,
            phone
        })

        const _id = await newUser.save().then(res => res.id)
        if (!_id) throw Error("Not found")

        return generateToken({ _id })
    },

    login: async (_, { email, password, phone }, { decoded, token }) => {
        if (!email && !phone) throw Error("Must provide email or phone number")
        if (!password) throw Error("Invalid password format")

        if (decoded) return token

        let userData;

        if (!phone && email) userData = await User.findOne({ email })
        else if (phone) userData = await User.findOne({ phone })

        if (!userData) throw Error("No Access")

        const passwordCheck = await bcrypt.compare(password, userData.password)

        if (!passwordCheck) throw Error("No Access")

        return generateToken({ _id: userData._id })
    },

    auth: async (_, args, { decoded, token }) => {
        if (decoded) return true
        else return false
    },

    modifyModule: async (model = "modules", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded }),

    deleteModule: async (_, { data }, { decoded }) => {
        return await deleteFunction("modules", { data }, { decoded })
    },
    modifyPage: async (model = "pages", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded }),

    deletePage: async (_, { data }, { decoded }) => {
        return await deleteFunction("pages", { data }, { decoded })
    }
}