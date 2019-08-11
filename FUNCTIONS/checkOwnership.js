const checkOwnership = async (model, _id, user) => {
    if (!_id) throw Error("No access")
    const modelOwner = await model.findById(_id).then(res => res.user)
    if (JSON.stringify(user) !== JSON.stringify(modelOwner)) throw Error("No access")
}

module.exports = checkOwnership