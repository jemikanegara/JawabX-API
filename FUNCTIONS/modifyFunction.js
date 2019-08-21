const createFunction = require('./createFunction')
const updateFunction = require('./updateFunction')

const modifyFunction = async (model, { data }, { decoded }) => {
    if (!decoded) throw Error("No Access")
    const { _id } = data

    let dataId

    if (!_id) {
        dataId = await createFunction(model, { data }, { decoded })
    }

    else {
        dataId = await updateFunction(model, { data }, { decoded })
    }

    return await dataId
}

module.exports = modifyFunction