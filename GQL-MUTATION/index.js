
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

const checkOwnership = async (model, _id, user) => {
    const modelOwner = await model.findById(_id).then(res => res.user)
    if (JSON.stringify(user) === JSON.stringify(modelOwner)) throw Error("No access")
}

const createFunction = async (model, { data }, { decoded }) => {
    let dbModel
    let newData = data

    for (let key in models) {
        if (model.includes(key)) {
            dbModel = models[key]
            break
        }
    }

    for (let key in data) {
        if (Array.isArray(data[key])) {
            const keyArray = data[key].slice()
            const createdKey = await keyArray.map(async el => {
                return await createFunction(key, { data: el }, { decoded })
            })
            const resolvedKey = await Promise.all(createdKey)
            newData[key] = resolvedKey
        }
    }

    const newModel = await new dbModel({ ...newData, user: decoded._id })
    return await newModel.save().then(res => res._id)
}

const updateFunction = async (model, { data }, { decoded }) => {
    const { _id } = data
    await checkOwnership(Module, _id, decoded._id)

    let dbModel

    for (let key in models) {
        if (model.includes(key)) {
            dbModel = models[key]
            break
        }
    }

    let oldData = await dbModel.findById(_id)

    for (let key in data) {
        if (oldData[key] !== data[key]) oldData[key] = data[key]
    }

    newData = new Module(oldData)
    return await newData.save().then(res => res._id)
}



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
    modifyModule: async (model = "modules", { data }, { decoded }) => {
        const { _id } = data

        let moduleId

        if (!_id) {
            moduleId = await createFunction(model, { data }, { decoded })
        }

        else {
            moduleId = await updateFunction(model, { data }, { decoded })
        }

        return await moduleId
    },
    deleteModule: async (_, { data }, { decoded }) => {
        const { _id } = data
        await checkOwnership(Page, _id, decoded._id)
        return await Module.findByIdAndDelete(_id)
    },
    modifyPage: async (model = "pages", { data }, { decoded }) => {
        const { _id, explanation, type, answers } = data

        let newPage

        // if (!_id) {
        //     const createdAnswers = answers.map(async answer => {
        //         const newAnswer = new Answer(answer)
        //         return await newAnswer.save().then(res => res._id)
        //     })

        //     const resolvedAnswer = Promise.all(createdAnswers)

        //     newPage = new Page({ explanation, type, answers: resolvedAnswer, user: decoded._id })
        // }

        if (!_id) {
            await createFunction(model, { data }, { decoded })
        }

        else {
            await checkOwnership(Page, _id, decoded._id)

            let oldPage = await Page.findById(_id)

            for (key in data) {
                if (oldPage[key] !== data[key]) oldPage[key] = data[key]
            }

            newPage = new Page(oldPage)
        }

        return await newPage.save().then(res => res.id)
    },
    deletePage: async (_, { data }, { decoded }) => {
        const { _id } = data
        await checkOwnership(Page, _id, decoded._id)
        return await Page.findByIdAndDelete(_id)
    }
}