const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_SECRET_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

AWS.config.setPromisesDependency(Promise);

const S3 = new AWS.S3();

const uploadImage = async (image) => {
    // Set Params
    const params = {
        ACL: "public-read",
        Body: image.createReadStream ? image.createReadStream() : image.data,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        ContentType: image.mimetype,
        Key: `${Date.now().toString()}-${image.filename}`
    };

    // Upload Image
    return await S3.upload(params).promise();
}

const uploadMultiImages = async (images) => {
    const packageUploadedPromise = await images.map(async singleImg => {
        const packageUploadedImage = await uploadImage(singleImg)
        if (!packageUploadedImage.Key) throw Error("Upload Failed");
        return { category: singleImg.category, key: packageUploadedImage.Key }
    })

    return await Promise.all(packageUploadedPromise)
}

const getImage = async (image) => {
    // Set Params
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: image
    };

    // Download Image
    return await S3.getObject(params).promise();
}

const deleteImage = async (image) => {
    // Set Params
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: image
    };

    // Delete Image
    return await S3.deleteObject(params).promise()
}

const deleteMultiImages = async (images) => {
    const imagesParams = images.map(image => ({ Key: image }))
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Delete: {
            Objects: imagesParams,
            Quiet: false
        }
    };
    return await S3.deleteObjects(params).promise();
}

module.exports = {
    uploadImage,
    uploadMultiImages,
    getImage,
    deleteImage,
    deleteMultiImages
};