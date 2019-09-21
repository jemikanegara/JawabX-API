const createFunction = require('./createFunction')
const updateFunction = require('./updateFunction')
const User = require('../MONGO-SCHEMA/user')

const modifyFunction = async (model, { data }, { decoded }) => {
    if (!decoded) throw Error("No Access")
    const { _id } = data

    let dataId

    if (!_id) {
        checkValidUser = await User.findById(decoded._id)
        if (!checkValidUser) throw Error('Invalid User')
        dataId = await createFunction(model, { data }, { decoded })
    }

    else {
        dataId = await updateFunction(model, { data }, { decoded })
    }

    return await dataId
}

module.exports = modifyFunction