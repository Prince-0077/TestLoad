require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 

const Endpoint = require('./models/Endpoint');
const { faker } = require('@faker-js/faker');
const { Redis } = require('@upstash/redis');

const app = express();


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

app.use(cors());
app.use(express.json());




const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" MongoDB Connected Successfuly");
    } catch (error) {
        console.error(" MongoDB Connection Error: ", error.message);
        process.exit(1); 
    }
};


connectDB();



app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: "testload server is running SMoothly! "
    });
});



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

        
        const cachedData = await redis.get(currentSlug);
        if (cachedData) {
            console.log(" CACHE HIT: Serving from RAM");
            return res.json(cachedData); 
        }

       
        console.log(" CACHE MISS: Querying DB & Generating Data");
        const endpointData = await Endpoint.findOne({ slug: currentSlug });

        if (!endpointData) {
            return res.status(404).json({ error: "Endpoint not found!" });
        }

        const fakeResults = [];
        for (let i = 0; i < 10; i++) {
            let singleRecord = {};
            endpointData.fields.forEach((field) => {
                if (field.type === 'string') singleRecord[field.name] = faker.person.fullName();
                else if (field.type === 'number') singleRecord[field.name] = faker.number.int({ min: 18, max: 80 });
                else if (field.type === 'email') singleRecord[field.name] = faker.internet.email();
                else singleRecord[field.name] = "Unknown Type";
            });
            fakeResults.push(singleRecord);
        }

       
        await redis.set(currentSlug, fakeResults, { ex: 60 });

        res.json(fakeResults);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});