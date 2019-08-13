const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: "7d" })
}

const checkToken = (token) => {
    if (!token) return false
    token = token.split(" ")[1]
    const check = jwt.verify(token, secretKey)
    if (!check) return false
    else return check
}

module.exports = {
    generateToken,
    checkToken
}