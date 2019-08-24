const checkOwnership = require('./checkOwnership')
const getModel = require('./getModel')

let globalChildrenToDelete = [] // expect  {parent : Model, children: [child_id]}
let topLevelCount = 0

const topLevelFunction = async (level, _id, dbModel, model, dbParent) => {
    if (level > 0) return false
    else if (topLevelCount > 0) return true
    else {
        topLevelCount = 1
        // Remove Model Data
        const deletedData = await dbModel.findByIdAndDelete(_id, { new: false }).populate(model)
        if (!deletedData) throw Error("delete model data failed")

        // Update Parents Data
        dbParent && dbParent.forEach(async dbParentModel => {
            const dbParentData = await dbParentModel
                .updateMany({ [model]: { $in: _id } }, { $pull: { [model]: { $in: _id } } })
            if (!dbParentData) throw Error("delete parent data failed")
        })

        // Execute Batch Delete
        const groupedChildren = globalChildrenToDelete.slice().reduce(function (acc, currentValue) {
            (acc[currentValue.key] = acc[currentValue.key] || []).push(currentValue);
            return acc;
        }, {});

        for (let key in groupedChildren) {
            let ids = []
            let dbModel
            await groupedChildren[key].forEach(child => {
                ids = [...ids, ...child.ids]
                dbModel = child.dbModel
            })
            await dbModel.deleteMany({ _id: { $in: ids } })
        }
        return true
    }
}

const deleteFunction = async (model, { data }, { decoded }, level = 0) => {
    const { _id } = data
    const { dbModel, dbParent } = getModel(model)
    await checkOwnership(dbModel, _id, decoded._id)

    // Get Data of current ID
    const modelData = await dbModel.findById(_id)

    // Initialize response
    let response = true

    // Collect Children Data
    for (let key in modelData) {

        // Get copy of top db model
        const topDB = dbModel

        // Array Checking
        const isArray = Array.isArray(modelData[key])
        if (isArray) {

            // Get GrandChild
            modelData[key].forEach(grandChild_id => {

                // Set ID in argument
                const args = { data: { _id: grandChild_id } }

                // Run delete recursively
                const newLevel = level + 1
                deleteFunction(key, args, { decoded }, newLevel).then(() => {
                    topLevelFunction(level, _id, topDB, model, dbParent).then(res => {
                        response = res
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            })

            // Set this children model
            const { dbModel } = getModel(key)
            const ids = modelData[key]

            // Push to data collector
            globalChildrenToDelete.push({ dbModel, ids, level, key })
        }
    }

    return response
}

module.exports = deleteFunction