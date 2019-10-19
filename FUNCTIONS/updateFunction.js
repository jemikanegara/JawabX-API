const checkOwnership = require('./checkOwnership')
const getModel = require('./getModel')

const updateFunction = async (model, { data }, { decoded }) => {
    const { _id } = data
    const { dbModel } = getModel(model)

    await checkOwnership(dbModel, _id, decoded._id)

    let oldData = await dbModel.findById(_id)

    for (let key in data) {
        if (data[key] && oldData[key] !== data[key]) oldData[key] = data[key]
    }

    newData = new dbModel(oldData)
    return await newData.save().then(res => res._id)
}

module.exports = updateFunction