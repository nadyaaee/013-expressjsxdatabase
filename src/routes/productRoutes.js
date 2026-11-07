const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct
} = require('../controllers/productController');

// GET semua produk
router.get('/', getAllProducts);

// GET produk berdasarkan ID
router.get('/:id', getProductById);

// POST menambahkan produk
router.post('/', createProduct);

module.exports = router;
