const getModel = require('./getModel')
const uploadImages = require('./uploadImages')

const createFunction = async (model, { data }, { decoded }) => {
    let newData = data
    const { dbModel } = getModel(model)
    const { images, parent } = data

    for (let key in data) {
        if (Array.isArray(data[key]) && key !== 'images') {
            const keyArray = data[key].slice()
            const createdKey = await keyArray.map(async el => {
                return await createFunction(key, { data: el }, { decoded })
            })
            const resolvedKey = await Promise.all(createdKey)
            newData[key] = resolvedKey
        }

        if (model === 'answers') {
            if (key === 'journal' || key === 'multi' || key === 'single') {
                data[key].trueAnswer = new Map(Object.entries(data[key].trueAnswer))
            }
        }
    }

    if (data.images) newData.images = await uploadImages(images)

    const newModel = await new dbModel({ ...newData, user: decoded._id })
    const saved = await newModel.save().then(res => res._id)

    // Parent : {_id: ID, model: String, order: Number}
    if (parent) {
        const getParentModel = getModel(parent.model)
        parentModel = getParentModel.dbModel
        let parentData = parentModel.findById(parent._id)
        parentData[model].splice(parent.order, 0, parentData._id)
        await parentData.save()
    }

    return saved
}

module.exports = createFunction