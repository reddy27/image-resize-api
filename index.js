const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.post('/reduceImage', upload.single('image'), (req, res) => {
    const { file } = req;
    const { width, height } = req.body;

    if(!file) {
        return res.status(400).send('No image file uploaded');
    }

    sharp(file.path)
        .resize(parseInt(width), parseInt(height))
        .toBuffer()
        .then(data => {
            fs.writeFile(file.destination + 'output.jpg', data, (err) => {
                if(err) {
                    return res.status(500).send('Unable to write file');
                }
                res.send('Image resized successfully');
            });
        })
        .catch(err => {
            res.status(500).send('Error resizing image');
        })
});

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
