#  Online Auction Platform  

A **real-time online auction platform** built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.io** for real-time bidding functionality.  

![Dashboard Screenshot](./client/public/screenshots/dashboard.png)  

---

## 🚀 Features  
- 🔑 User authentication and authorization (JWT)  
- 📦 Product listing and management  
- ⚡ Real-time auction creation and bidding  
- 📊 Dashboard for managing products, auctions, and bids  
- 📱 Responsive design with **Bootstrap**  
- 🔔 Live notifications with Socket.io  

---

## 🛠️ Tech Stack  

**Frontend:** React, Bootstrap, Socket.io-client  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Real-time:** Socket.io  
**Authentication:** JWT (JSON Web Tokens)  

---

## 📦 Prerequisites  

- Node.js (v14 or higher)  
- MongoDB (local or Atlas)  
- npm or yarn  

---

🔹 Install client dependencies
cd ../client
npm install

🔹 Setup environment variables

Create a .env file in the server/ directory:

MONGODB_URI=mongodb://localhost:27017/auction-platform
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

🏃 Running the Application
Development Mode

Run both client and server concurrently:

cd server
npm run dev


Backend: http://localhost:5000

Frontend: http://localhost:3000

Production Mode

Build the client:

cd client
npm run build


Start the server:

cd ../server
npm start

📡 API Endpoints
🔐 Authentication

POST /api/users/register – Register a new user

POST /api/users/login – Login a user

👤 Users

GET /api/users/profile – Get current user profile

PUT /api/users/profile – Update user profile

PUT /api/users/password – Change password

📦 Products

POST /api/products – Create a new product

GET /api/products – Get all products

GET /api/products/:id – Get product by ID

PUT /api/products/:id – Update product

DELETE /api/products/:id – Delete product

GET /api/products/user/me – Get products by logged-in user

🏦 Auctions

POST /api/auctions – Create a new auction

GET /api/auctions – Get all auctions

GET /api/auctions/active – Get active auctions

GET /api/auctions/:id – Get auction by ID

PUT /api/auctions/:id – Update auction

DELETE /api/auctions/:id – Cancel auction

GET /api/auctions/user/me – Get auctions by logged-in user

💸 Bids

POST /api/bids – Place a new bid

GET /api/bids/auction/:auctionId – Get all bids for auction

GET /api/bids/user/me – Get user bids

GET /api/bids/active – Get active bids

GET /api/bids/won – Get auctions won

🔔 Socket.io Events

joinAuction – Join an auction room

leaveAuction – Leave an auction room

newBid – Place a new bid

bidPlaced – Receive notification of a new bid
