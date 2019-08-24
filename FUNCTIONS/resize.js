const sharp = require('sharp')

const resize = async (
    image,
    category,
    {
        width = 200,
        height = 200,
        options = { fit: 'inside' }
    },
) => {

    const { mimetype, filename } = image
    const readed = await image.createReadStream()

    const resizedImage = new Promise((resolve, reject) => {
        let chunks = []

        readed.on("data", (chunk) => {
            chunks.push(chunk)
        })
        readed.on("end", () => {
            sharp(Buffer.concat(chunks))
                .resize(width, height, options)
                .toBuffer({ resolveWithObject: true })
                .then(
                    ({ data }) => {
                        const resized = { data, mimetype, filename, category }
                        resolve(resized)
                    }
                )
        })
    })

    return await resizedImage
}

module.exports = resize