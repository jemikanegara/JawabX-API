const getModel = require('./getModel')
const uploadImages = require('./uploadImages')

const createFunction = async (model, { data }, { decoded }, noParentUpdate) => {
    let newData = data
    const { dbModel, dbParent } = getModel(model)
    const { images, parent } = data

    if (!parent && dbParent && !noParentUpdate) throw Error("No parent information")

    for (let key in data) {
        if (Array.isArray(data[key]) && key !== 'images') {
            const keyArray = data[key].slice()
            const createdKey = await keyArray.map(async el => {
                return await createFunction(key, { data: el }, { decoded }, true)
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

    // Parent : {_id: ID, order: Number}
    if (dbParent && !noParentUpdate) {
        // Get Parent Data From Database
        let parentData = dbParent.findById(parent._id)

        // Splice Array
        parentData[model].splice(parent.order, 0, saved._id)

        // Save Parent
        await parentData.save()
    }

    return saved
}

module.exports = createFunction