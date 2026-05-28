# System Architecture: TestLoad Engine

This document outlines the architecture of the TestLoad API Engine, designed specifically to be stress-tested and optimized for high-concurrency traffic.

## Phase 1: The Vanilla Flow (Baseline)
1. **Frontend (React):** User defines the API blueprint (e.g., 'Name', 'Age').
2. **Backend (Express):** Receives the blueprint and validates it.
3. **Database (MongoDB):** Stores the blueprint and generates a unique URL (slug).
4. **Data Generation:** On GET request, Express fetches the blueprint from MongoDB, generates 10 random fake records via Faker.js, and returns JSON.
*Bottleneck:* Single-threaded Node.js chokes on simultaneous MongoDB I/O and heavy CPU generation under load.

## Phase 2: The Data Optimization (Redis)
Objective: Bypass repetitive Database network calls and redundant CPU generation.
1. **In-Memory Caching:** When a URL is hit the first time, data is generated and a copy is stored in Redis (RAM).
2. **Cache Hit:** Subsequent requests for the same URL completely bypass MongoDB and Faker.js. The Express server serves the pre-generated data directly from RAM at sub-millisecond speed.

## Phase 3: The Compute Optimization (PM2)
Objective: Prevent the single Node.js event loop from freezing under heavy connection requests.
1. **Horizontal Scaling (Clustering):** PM2 duplicates the single Node.js server instance across all available CPU cores on the machine.
2. **Load Balancing:** Incoming traffic is automatically distributed among multiple Node.js worker threads, drastically increasing the system's capacity to handle concurrent users without timing out.