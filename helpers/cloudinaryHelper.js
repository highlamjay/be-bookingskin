const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
  try {
    console.log('Uploaded file path:', filePath);
    const result = await cloudinary.uploader.upload(filePath);
    console.log('result', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Error while uploading to cloudinary", error);
    throw new Error("Error while uploading to cloudinary");
  }
};

module.exports = { uploadToCloudinary}