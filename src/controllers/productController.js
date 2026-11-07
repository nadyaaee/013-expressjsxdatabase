const products = require('../products');

// GET semua produk
const getAllProducts = (req, res) => {
    res.status(200).json(products);
};

// GET produk berdasarkan ID
const getProductById = (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(item => item.id === id);

    if (!product) {
        return res.status(404).json({
            message: 'Produk tidak ditemukan'
        });
    }

    res.status(200).json(product);
};

// POST menambahkan produk
const createProduct = (req, res) => {
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

    const newProduct = {
        id: Math.max(0, ...products.map(item => item.id)) + 1,
        name: name.trim(),
        price: Number(price)
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct
};
