const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');

function searchFiles(searchTerm) {
    const results = [];
    const files = fs.readdirSync(uploadsDir);

    files.forEach(file => {
        if (file.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
                name: file,
                path: path.join(uploadsDir, file),
                type: path.extname(file).slice(1) // Get file extension
            });
        }
    });

    return results;
}

module.exports = {
    searchFiles
};