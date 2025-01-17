const express = require('express');
const router = express.Router();

const { 
    createProduct, 
    fetchAllProducts, 
    fetchDetailProduct, 
    editProduct,
    deleteProduct
} = require('../controllers/product-controller'); 
const adminMiddleware = require('../middlewares/admin-middleware');

router.post('/create', adminMiddleware, createProduct)
router.get('/fetch-all', fetchAllProducts)
router.get('/fetch-detail/:id', fetchDetailProduct)
router.put('/edit/:id', adminMiddleware, editProduct)
router.delete('/delete/:id', adminMiddleware, deleteProduct)

module.exports = router;