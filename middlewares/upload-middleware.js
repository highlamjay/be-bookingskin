const path = require("path");
const multer = require("multer");

//set our multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
}); 

const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video"))  {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload an image.", 400), false);
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, //20MB file size limit
    },
});