const models = require('./models')
const checkOwnership = require('./checkOwnership')

const updateFunction = async (model, { data }, { decoded }) => {
    if (!decoded) throw Error("No Access")
    const { _id } = data
    let dbModel

    for (let key in models) {
        if (model.includes(key)) {
            dbModel = models[key]
            break
        }
    }

    await checkOwnership(dbModel, _id, decoded._id)

    let oldData = await dbModel.findById(_id)

    for (let key in data) {
        if (oldData[key] !== data[key]) oldData[key] = data[key]
    }

    newData = new dbModel(oldData)
    return await newData.save().then(res => res._id)
}

module.exports = updateFunction