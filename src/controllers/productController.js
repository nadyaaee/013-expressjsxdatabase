const prisma = require('../prisma');

// GET semua produk
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data produk'
        });
    }
};

// GET produk berdasarkan ID
const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID produk tidak valid'
            });
        }

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({
                message: 'Produk tidak ditemukan'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data produk'
        });
    }
};

// POST menambahkan produk
const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (
            typeof name !== 'string' ||
            name.trim() === '' ||
            price === undefined ||
            price === null ||
            price === '' ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: 'Nama dan harga produk tidak valid'
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: name.trim(),
                price: Number(price)
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal menambahkan produk'
        });
    }
};

// PUT mengupdate produk berdasarkan ID
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id || req.body.id);
        const { name, price } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID produk tidak valid'
            });
        }

        if (
            typeof name !== 'string' ||
            name.trim() === '' ||
            price === undefined ||
            price === null ||
            price === '' ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: 'Nama dan harga produk tidak valid'
            });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: name.trim(),
                price: Number(price)
            }
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                message: 'Produk tidak ditemukan'
            });
        }

        res.status(500).json({
            message: 'Gagal mengupdate produk'
        });
    }
};

// DELETE menghapus produk berdasarkan ID
const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID produk tidak valid'
            });
        }

        const deletedProduct = await prisma.product.delete({
            where: { id }
        });

        res.status(200).json({
            message: 'Produk berhasil dihapus',
            data: deletedProduct
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                message: 'Produk tidak ditemukan'
            });
        }

        res.status(500).json({
            message: 'Gagal menghapus produk'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

