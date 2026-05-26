const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();
const Endpoint = require('./models/Endpoint');
const { faker } = require('@faker-js/faker');

const app = express();

app.use(cors());
app.use(express.json());




const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error: ", error.message);
        process.exit(1); // Agar DB connect na ho toh server band kar do
    }
};


connectDB();

// Routes

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: "testload Server is running smoothly! "
    });
});

//Post route

app.post('/api/endpoints', async (req, res) => {
    try {
        
        const { name, fields } = req.body;

       
        if (!name || !fields || fields.length === 0) {
            return res.status(400).json({ error: "Name and fields are required!" });
        }

        
        const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 100000);

       
        const newEndpoint = new Endpoint({
            name: name,
            slug: slug,
            fields: fields
        });

        
        await newEndpoint.save();

        
        res.status(201).json({
            success: true,
            message: "API Endpoint Created!",
            url: `/api/v1/mock/${slug}`,
            data: newEndpoint
        });

    } catch (error) {
        console.error("Error creating endpoint:", error);
        res.status(500).json({ error: "Server error while creating endpoint" });
    }
});



app.get('/api/v1/mock/:slug', async (req, res) => {
    try {
        
        const currentSlug = req.params.slug;

        
        const endpointData = await Endpoint.findOne({ slug: currentSlug });

        
        if (!endpointData) {
            return res.status(404).json({ error: "Endpoint not found! Check your URL." });
        }

       
        const fakeResults = [];
        
        for (let i = 0; i < 10; i++) {
            let singleRecord = {};

            
            
            endpointData.fields.forEach((field) => {
                if (field.type === 'string') {
                    singleRecord[field.name] = faker.person.fullName();
                } else if (field.type === 'number') {
                    singleRecord[field.name] = faker.number.int({ min: 18, max: 80 });
                } else if (field.type === 'email') {
                    singleRecord[field.name] = faker.internet.email();
                } else {
                    singleRecord[field.name] = "Unknown Type";
                }
            });

            fakeResults.push(singleRecord);
        }

        
        res.json(fakeResults);

    } catch (error) {
        console.error("Error generating mock data:", error);
        res.status(500).json({ error: "Server error while generating data" });
    }
}); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});