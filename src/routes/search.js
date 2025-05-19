const express = require('express');
const { Storage } = require('@google-cloud/storage');

const router = express.Router();
const bucketName = 'web-search-project-bucket'; // Nama bucket Anda
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS; // Path ke file JSON dari variabel lingkungan

if (!keyFilename) {
    console.error('Error: GOOGLE_APPLICATION_CREDENTIALS tidak ditemukan di file .env');
    process.exit(1); // Keluar jika variabel lingkungan tidak ditemukan
}

const storage = new Storage({ keyFilename });
const bucket = storage.bucket(bucketName);

router.get('/', async (req, res) => {
    const q = req.query.q ? req.query.q.toLowerCase() : '';
    const page = parseInt(req.query.page, 10) || 1; // Halaman saat ini (default: 1)
    const pageSize = parseInt(req.query.pageSize, 10) || 10; // Jumlah item per halaman (default: 10)

    try {
        // Ambil daftar file dari bucket
        const [files] = await bucket.getFiles();
        const filteredFiles = files
            .filter(file => file.name.toLowerCase().includes(q)) // Filter file berdasarkan query
            .map(file => ({
                name: file.name,
                url: `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(file.name)}` // URL publik file
            }));

        // Implementasi pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedFiles = filteredFiles.slice(startIndex, startIndex + pageSize);

        res.status(200).json({
            items: paginatedFiles,
            hasMore: startIndex + pageSize < filteredFiles.length // Indikator apakah ada halaman berikutnya
        });
    } catch (err) {
        console.error('Error fetching files from bucket:', err);
        res.status(500).json({ error: 'Failed to fetch files from bucket' });
    }
});

module.exports = router;