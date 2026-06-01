# TestLoad: High-Concurrency System Architecture Showcase

## 🎯 The Objective
TestLoad is not just a utility tool; it is an engineering sandbox built to demonstrate backend scalability, performance optimization, and the ability to handle massive web traffic. 

It is designed to be deliberately stress-tested with thousands of concurrent virtual users to showcase how a Node.js/Express backend handles heavy loads, and how infrastructure can be optimized to prevent server crashes and database bottlenecks.

##  ⚙️Tech Stack & Engineering focus
- **Core Backend:** Node.js, Express.js (Focus on event-loop optimization)
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Infrastructure Scaling:** Node Clustering (PM2), Redis Caching, Load Balancing
- **Testing Weapon:** Artillery.io / k6 for load simulation

## 🚀 How to Run (local Testing)
1. Clone the repository and navigate to the backend folder.
2. Run `npm install` to install core dependencies.
3. Create a `.env` file with `PORT=5000` and your `MONGO_URI`.
4. Run `npm run dev` to boot the server.



## 📊 Performance Case Study: Unblocking the Event Loop

To demonstrate the necessity of caching in high-concurrency environments, I intentionally stress-tested the base Express server using **Artillery.io** (simulating 5,350 concurrent users over 30 seconds). 

### 🔴 Phase 1: The Baseline (Vanilla Node.js).
* **Failure Rate:** 3,369 Timeouts (`ERR_SOCKET_TIMEOUT`)
* **p95 Latency:** `7,709.8 ms` (7.7 seconds)
* **The Bottleneck:** Node.js is single-threaded. Redundant MongoDB queries and CPU-heavy fake data generation for the exact same API slug choked the event loop, causing thousands of requests to expire in the queue.

###  Phase 2: The Optimization (In-Memory Redis Cache).
I integrated **Upstash Redis** to intercept repetitive API calls. On the first hit, data is generated and cached in RAM. Subsequent requests are served directly from the cache.
* **Failure Rate:** `0` (100% Success)
* **p95 Latency:** `232.8 ms` (A **~97% drop** in latency)
* **The Result:** By bypassing the database and CPU generation entirely, the server handles massive read-heavy traffic with sub-second response times.

### 🟣Phase 3: The CPU Fix (PM2 Clustering).
Redis fixed the database bottleneck, but Node.js is still single-threaded. To prevent the CPU from choking under massive load, I implemented **PM2 for Horizontal Scaling**.

* **The Shift:** Used PM2's Cluster Mode to split the server across all CPU cores—turning a single-lane road into a multi-lane highway.
* **The Benchmark:** Safely absorbed the 5,350 user spike. Throughput jumped to **175 req/sec** with p95 latency stabilized at **~240ms**.
* **The Impact:** Redis (Data Layer) + PM2 (Compute Layer) transformed a fragile server into a resilient, production-ready engine.