const checkOwnership = require('./checkOwnership')

const deleteFunction = async (model, { data }, { decoded }) => {
    console.log(model)
    const { _id } = data
    await checkOwnership(model, _id, decoded._id)
    return await model.findByIdAndDelete(_id) ? true : false
}

module.exports = deleteFunction