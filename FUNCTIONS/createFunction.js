const getModel = require('./getModel')

const createFunction = async (model, { data }, { decoded }) => {
    let newData = data
    const { dbModel } = getModel(model)

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

module.exports = createFunction