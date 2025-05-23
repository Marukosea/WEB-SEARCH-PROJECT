require('dotenv').config(); // Memuat variabel dari file .env
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan'); // Untuk logging

const app = express();
const PORT = process.env.PORT || 3000;

// Ganti dengan nama bucket kamu
const bucketName = 'web-search-project-bucket';
// Path ke file JSON yang sudah kamu download
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!keyFilename) {
console.error('Error: GOOGLE_APPLICATION_CREDENTIALS tidak ditemukan di file .env');
process.exit(1); // Keluar jika variabel lingkungan tidak ditemukan
}

// Tambahan: Baca file JSON untuk memastikan file dapat diakses
try {
const config = JSON.parse(fs.readFileSync(keyFilename, 'utf8'));
console.log('Config file loaded successfully:', config.project_id);
} catch (err) {
console.error('Error reading config file:', err.message);
process.exit(1); // Keluar jika file tidak dapat dibaca
}

const storage = new Storage({ keyFilename });
const bucket = storage.bucket(bucketName);

// Multer untuk buffer file
const upload = multer({ storage: multer.memoryStorage() });

// Middleware untuk logging
app.use(morgan('combined')); // Logging request ke terminal
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint upload ke GCS
app.post('/upload', upload.single('file'), async (req, res) => {
if (!req.file) {
return res.status(400).json({ message: 'No file uploaded' });
}
const blob = bucket.file(req.file.originalname);
const blobStream = blob.createWriteStream({
resumable: false,
contentType: req.file.mimetype,
});

});

// Endpoint search dengan pagination
app.get('/search', async (req, res) => {
const pageSize = parseInt(req.query.pageSize) || 10; // Default 10 file per halaman
const pageToken = req.query.pageToken || null;

});

// Endpoint delete untuk menghapus file dari bucket
app.delete('/delete/:filename', async (req, res) => {
const filename = req.params.filename;

});

// Endpoint download untuk mengunduh file dari bucket
app.get('/download/:filename', async (req, res) => {
const filename = req.params.filename;

});

app.listen(PORT, () => {
console.log(Server is running on http://localhost:${PORT});
});