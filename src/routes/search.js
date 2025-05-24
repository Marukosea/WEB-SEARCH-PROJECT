require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Ganti dengan nama bucket kamu
const bucketName = 'web-search-project-bucket';

// Gunakan buffer dari variabel lingkungan
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT;
if (!credentials) {
    console.error('Error: GOOGLE_APPLICATION_CREDENTIALS_CONTENT tidak ditemukan.');
    process.exit(1);
}

const storage = new Storage({ credentials: JSON.parse(credentials) });
const bucket = storage.bucket(bucketName);

// Multer untuk buffer file
const upload = multer({ storage: multer.memoryStorage() });

// Middleware untuk logging
app.use(morgan('combined'));
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

    blobStream.on('error', (err) => {
        console.error('Error uploading file:', err.message);
        res.status(500).json({ message: 'Failed to upload file', error: err.message });
    });

    blobStream.on('finish', () => {
        res.status(200).json({ message: 'File uploaded successfully' });
    });

    blobStream.end(req.file.buffer);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});