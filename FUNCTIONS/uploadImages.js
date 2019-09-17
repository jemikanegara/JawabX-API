const resize = require('./resize')
const { uploadMultiImages } = require('./s3')

const resizeDimension = [
    { ori: true },
    {
        category: "small",
        params: {
            height: 100,
            width: 100,
            options: { fit: 'inside' }
        }
    },
    {
        category: "medium",
        params: {
            height: 300,
            width: 300,
            options: { fit: 'inside' }
        }
    },
]

const uploadImages = async (images) => {
    console.log(images)
    // Images Processing & Upload
    const resizedImages = await images.map(async image => {
        // Resize
        const sizes = resizeDimension.map(async ({ ori, params, category }) => {
            // Original Image
            if (ori) {
                const oriImg = await image
                oriImg.category = "original"
                return oriImg
            }
            // Resized Image
            else return await resize(await image, category, params)
        })
        // Resolve
        const resized = await Promise.all(sizes)
        // Upload
        return await uploadMultiImages(resized)
    })

    // Resolve Promise
    const resolvedImages = await Promise.all(resizedImages)

    // Mapping Array of Images
    const imageKeys = resolvedImages.map(image => {
        const reducedProp = image.map(({ category, key }) => ({ [category]: key }))
        const newImgObj = Object.assign({}, ...reducedProp)
        return newImgObj
    })
    return imageKeys
}

module.exports = uploadImages