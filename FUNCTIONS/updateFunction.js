const models = require('./models')
const checkOwnership = require('./checkOwnership')

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

module.exports = updateFunction