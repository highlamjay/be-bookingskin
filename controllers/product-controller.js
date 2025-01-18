const { uploadToCloudinary, uploadVideoToCloudinary } = require('../helpers/cloudinaryHelper');
const Product = require('../models/Product')

//create product controller
const createProduct = async (req, res) => {
    try {
        const { name, imagePath, price, description, videoPath } = req.body;

        //check product exist
        const product = await Product.findOne({name});
        if(product){
            return res.status(400).json({
                success: false,
                message: 'Product already exist ! Please try again !'
            })
        }
        
        // upload image to Cloudinary
        const imageUploadResult = await uploadToCloudinary(imagePath);

        // upload video to Cloudinary
        const videoUploadResult = await uploadVideoToCloudinary(videoPath);

        const newProduct = new Product({
            name,
            image: imageUploadResult.url,
            price,
            description,
            video: videoUploadResult.url,
        })

        //check created product 
        if(!newProduct){
            return res.status(400).json({
                success: false,
                message: 'Product not created ! Please try again !'
            })
        }

        await newProduct.save()

        res.status(200).json({
            success: true,
            message: "Product created successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//fetch all products controller
const fetchAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        const sortObject = {};
        sortObject[sortBy] = sortOrder;

        const products = await Product.find().sort(sortObject).skip(skip).limit(limit);
        if(!products){
            return res.status(400).json({
                success: false,
                message: 'Products not found ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully !',
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            data: products
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//fetch detail product controller
const fetchDetailProduct = async (req, res) => {
    try {
        const { id } = req.params.id;

        //check product exist
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Product not found ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product fetched successfully !',
            data: product
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//edit product controller
const editProduct = async (req, res) => {
    try {
        const { id } = req.params.id;
        const { name, image, price, description, video } = req.body;

        //check product exist
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Product not found ! Please try again !'
            })
        }

        //update product
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                image,
                price,
                description,
                video
            },
            {new: true}
        )

        //check product update 
        if(!updateProduct){
            return res.status(400).json({
                success: false,
                message: 'Product not updated ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully !',
            data: updateProduct
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//delete product controller
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params.id;

        //check product exist
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Product not found ! Please try again !'
            })
        }

        //delete product
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully !',
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    createProduct,
    fetchAllProducts,
    fetchDetailProduct,
    editProduct,
    deleteProduct
}
