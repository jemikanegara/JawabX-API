const models = require('./models')

const getModel = (model) => {
    let dbModel
    for (let key in models) {
        if (model.includes(key)) {
            dbModel = models[key]
            break
        }
    }
    return dbModel
}

module.exports = getModel



