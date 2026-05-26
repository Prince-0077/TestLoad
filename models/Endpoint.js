
const mongoose = require('mongoose');




const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true } 
});


const endpointSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    fields: [fieldSchema], 
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


module.exports = mongoose.model('Endpoint', endpointSchema);