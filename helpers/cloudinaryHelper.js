const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error("Error while uploading to cloudinary", error);
    throw new Error("Error while uploading to cloudinary");
  }
};

const uploadVideoToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video'
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Error while uploading video to cloudinary", error);
    throw new Error("Error while uploading video to cloudinary");
  }
};

module.exports = { uploadToCloudinary, uploadVideoToCloudinary };