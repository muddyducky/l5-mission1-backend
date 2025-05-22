//___ PACKAGES & IMPORTS ___
const express = require('express');
const axios = require('axios');
const multer = require('multer');
require('dotenv').config();


//___ ENABLE EXPRESS ___
const app = express();

//___ MIDDLEWARES ___
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//___
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: 'No image uploaded'})
        }

        const imageData = req.file.buffer;

        const response = await axios.post(
            process.env.AZURE_ENDPOINT,
            imageData,
            {
                headers: {
                    'Prediction-Key': process.env.AZURE_API_KEY,
                    'Content-Type': 'application/octet-stream'
                }
            }       
        );

        res.json({ vehicle: response.data.predictions });
    } catch (error) {
        console.error("Error processing image", error);
        res.status(500).json({ error: 'Error processing image'})
    }
})

//___ PORT ___
const PORT = process.env.PORT || 4000;
app.listen(PORT,() => {
    console.log(`Server listening at http://${process.env.PORT}`)
})
.on('error', (error) => {
    console.log('Sever error!', error)
})