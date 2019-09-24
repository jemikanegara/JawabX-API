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

        console.log(newUser)

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

    update: async (_, args, { decoded, token }) => {
        const { name, email, password, newPass, phone } = args
        if (!decoded._id) throw Error("No Access (TOKEN)")
        let userData = await User.findById(decoded._id).lean()
        if (!userData) throw Error("No Access (ID)")
        const passwordCheck = await bcrypt.compare(password, userData.password)
        if (!passwordCheck) throw Error("No Access (PASS)")

        let user = { ...userData, ...args }
        if (newPass) {
            user.password = await bcrypt.hash(newPass, 10)
            delete user.newPass // Remove plain password
        }

        const userUpdate = new User(user)
        userUpdate.isNew = false
        const _id = await userUpdate.save().then(res => res.id)
        if (!_id) throw Error("Not found")

        return generateToken({ _id: userData._id })
    },

    auth: async (_, args, { decoded, token }) => {
        if (decoded) return true
        else return false
    },

    modifyModule: async (model = "modules", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded }),

    deleteModule: async (_, { data }, { decoded }) =>
        await deleteFunction("modules", { data }, { decoded }),

    modifyPage: async (model = "pages", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded }),

    deletePage: async (_, { data }, { decoded }) =>
        await deleteFunction("pages", { data }, { decoded }),

    modifyAnswer: async (model = "answers", { data }, { decoded }) =>
        await modifyFunction(model, { data }, { decoded })
}