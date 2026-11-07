const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// GET semua produk
router.get('/', getAllProducts);

// GET produk berdasarkan ID
router.get('/:id', getProductById);

// POST menambahkan produk
router.post('/', createProduct);

// PUT mengupdate produk
router.put('/', updateProduct);
router.put('/:id', updateProduct);

// DELETE menghapus produk berdasarkan ID
router.delete('/:id', deleteProduct);

module.exports = router;