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