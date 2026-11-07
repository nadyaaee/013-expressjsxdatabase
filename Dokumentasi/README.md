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

# Petunjuk B

## Install Prisma

```
npm install @prisma/client@6
```

## Install Prisma CLI

```
npm install -D prisma@6
```

## Inisialisasi Prisma dengan SQLite

```
npx prisma init --datasource-provider sqlite
```

## Ganti `prisma/schema.prisma`

```

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

## Isi `.env`

```
DATABASE_URL="file:./dev.db"
```

## Jalankan migrasi database

```
npx prisma migrate dev --name init
```

## Buka Prisma Studio

```
npx prisma studio
```

## Buat file `src/prisma.js`

```

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;

```

## Ubah `src/controllers/productController.js`

```

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

```

## Ubah `src/routes/productRoutes.js`

```

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

```

## Jalankan project

```
npm run dev
```

## Pengujian

### Pengujian GET — Menampilkan seluruh produk

#### POSTMAN 

- Method: `GET` 
- URL: `http://localhost:3000/products`

![alt text](<Screenshots/PENGUJIAN 2/get-kosong.png>)

#### Prisma Studio

![alt text](<Screenshots/PENGUJIAN 2/prisma-kosong.jpeg>)

---

### Pengujian POST — Menambahkan produk

#### POST 

- Method: `POST`
- URL: `http://localhost:3000/products`
- Body: `raw`
- Format: `JSON`

Isi JSON satu per satu:

```
{
    "name": "Buku Tulis",
    "price": 15000
}
```

```
{
    "name": "Pulpen",
    "price": 5000
}
```

![alt text](<Screenshots/PENGUJIAN 2/post.png>)

#### GET after POST 

- Method: `GET`
- URL: `http://localhost:3000/products`

![alt text](<Screenshots/PENGUJIAN 2/get-after-post.png>)

#### Cek database menggunakan Prisma Studio

![alt text](<Screenshots/PENGUJIAN 2/prisma-after-post.png>)

---

### Pengujian PUT - Update Produk

#### PUT 

- Method: `PUT`
- URL: `http://localhost:3000/products/2`
- Body: `raw`
- Format: `JSON`

Isi JSON:
```
{
    "name": "Buku Gambar",
    "price": 20000
}
```

![alt text](<Screenshots/PENGUJIAN 2/put.png>)

#### GET after PUT

- Method: `GET`
- URL: `http://localhost:3000/products`

![alt text](<Screenshots/PENGUJIAN 2/get-after-put.png>)

#### Cek database menggunakan Prisma Studio

![alt text](<Screenshots/PENGUJIAN 2/prisma-after-put.png>)

---

### Pengujian DELETE - Menghapus Produk

#### DELETE

- Method: `DELETE`
- URL: `http://localhost:3000/products/2`

![alt text](<Screenshots/PENGUJIAN 2/delete.png>)

#### GET after DELETE

- Method: `GET`
- URL: `http://localhost:3000/products`

![alt text](<Screenshots/PENGUJIAN 2/get-after-delete.png>)

#### Cek database menggunakan Prisma Studio

![alt text](<Screenshots/PENGUJIAN 2/prisma-after-delete.png>)

---

## Pengujian Validasi dan Error

### POST tanpa nama produk

- Method: `POST`
- URL: `http://localhost:3000/products`
- Body: `raw`
- Format: `JSON`

Isi JSON:

```
{
    "name": "",
    "price": 15000
}
```
![alt text](<Screenshots/PENGUJIAN 2/post-tanpa-nama.png>)

---

### POST dengan harga negatif

- Method: `POST`
- URL: `http://localhost:3000/products`
- Body: `raw`
- Format: `JSON`

Isi JSON:
```
{
    "name": "Buku Baru",
    "price": -5000
}
```

![alt text](<Screenshots/PENGUJIAN 2/post-harga-negatif.png>)

---

### DELETE dengan ID yang tidak tersedia

- Method: `DELETE`
- URL: `http://localhost:3000/products/999`

![alt text](<Screenshots/PENGUJIAN 2/delete-id-tidak-ada.png>)