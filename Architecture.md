# System Architecture

This is a simple overview of how TestLoad works under the hood.

## The Data Flow
1. **Frontend (React):** The user fills out a simple form specifying what kind of data they want in their API   (e.g., asking for 'Name' and 'Email').
2. **Backend (Express):** The server receives this request and saves the "blueprint" of this API into the databse
3. **Database (MongoDB):** STores the blueprint and assigns a unique URL (slug) for the API.
4. **Data Generation:** When someone visits the new API URL, the Express server reads the blueprint from MongoDB, generates random fake data matching those rules, and sends it back as JSON.

 ## Core Files
- `server.js`: The main engine that starts the server and handles routing.
- `models/Endpoint.js`: The MongoDB schema defining how an API blueprint is saved in the database.