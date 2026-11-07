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
