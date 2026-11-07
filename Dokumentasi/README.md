# Petunjuk A

## Inisialisasi project Node.js

```
npm init -y
```
Perintah tersebut akan membuat file package.json.

## Install ExpressJS
```
npm install express
```

## Membuat Folder dan File

```
mkdir src
mkdir src/controllers
mkdir src/routes

New-Item src/controllers/productController.js
New-Item src/routes/productRoutes.js
New-Item src/products.js
New-Item src/index.js
```

## Isi `src/products.js`

```
const products = [
    { id: 1, name: 'Buku', price: 15000 },
    { id: 2, name: 'Pulpen', price: 5000 },
];

module.exports = products;
```

## Isi `src/controllers/productController.js`

```
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
```

## Isi `src/routes/productRoutes.js`

```
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
```

## Isi `src/index.js`

```
const express = require('express');
const app = express();

const productRoutes = require('./routes/productRoutes');

// Middleware untuk membaca JSON
app.use(express.json());

// Menggunakan routes produk
app.use('/products', productRoutes);

// Menjalankan server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

## Ganti `scipts` di `package.json`

```
"scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
},
```

## Menjalankan server

```
npm run dev
```

![alt text](<Screenshots/PENGUJIAN 1/npm-run-dev.png>)

## Daftar Endpoint

Base URL: `http://localhost:3000`

| No. | Method | Endpoint | Fungsi | Status |
|---|---|---|---|---|
| 1 | GET | `/products` | Menampilkan semua produk | 200 OK |
| 2 | GET | `/products/1` | Menampilkan produk berdasarkan ID | 200 OK |
| 3 | GET | `/products/999` | Menampilkan pesan jika produk tidak ditemukan | 404 Not Found |
| 4 | POST | `/products` | Menambahkan produk baru | 201 Created |

## PENGUJIAN 

### Menguji GET /products

```
http://localhost:3000/products
```

![alt text](<Screenshots/PENGUJIAN 1/get-products.png>)

---

### Menguji GET /products/1

```
http://localhost:3000/products/1
```

![alt text](<Screenshots/PENGUJIAN 1/get-products-1.png>)

---

### Menguji GET /products/999

```
http://localhost:3000/products/999
```

![alt text](<Screenshots/PENGUJIAN 1/get-products-999.png>)

---

### Menguji POST /products

```
Invoke-RestMethod `
-Uri "http://localhost:3000/products" `
-Method POST `
-ContentType "application/json" `
-Body '{"name":"Pensil","price":3000}'
```

![alt text](<Screenshots/PENGUJIAN 1/POST.png>)

![alt text](<Screenshots/PENGUJIAN 1/post-products.png>)