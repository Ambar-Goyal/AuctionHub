const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables first
dotenv.config();

// Import models
const Auction = require('./models/Auction');

// Define socket.io module exports before requiring routes
const socketModule = {};

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store io instance
socketModule.io = io;

// Import routes after socket setup
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const auctionRoutes = require('./routes/auctions');
const bidRoutes = require('./routes/bids');
const uploadsRoutes = require('./routes/uploads');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/uploads', uploadsRoutes);

// **Backend-only mode: catch all for non-API routes**
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  } else {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('Auction Platform API is running. Use the client to access frontend.');
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`Socket ${socket.id} joined auction room: ${auctionId}`);
  });

  socket.on('leaveAuction', (auctionId) => {
    socket.leave(auctionId);
    console.log(`Socket ${socket.id} left auction room: ${auctionId}`);
  });

  socket.on('newBid', (bid) => {
    console.log('New bid received:', bid);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Automatic auction status update
const updateAuctionStatuses = async () => {
  try {
    console.log('Running auction status update...');
    const result = await Auction.updateAllStatuses();

    if (result && result.updated > 0) {
      console.log(`Updated ${result.updated} auctions`);
      for (const auction of result.auctions) {
        const populatedAuction = await Auction.findById(auction._id)
          .populate('product')
          .populate('createdBy', 'name avatar')
          .populate('currentHighestBidder', 'name avatar');

        if (populatedAuction) {
          io.emit('auctionStatusChanged', populatedAuction);
          console.log(`Broadcast status change for auction ${auction._id}`);
        }
      }
    }
  } catch (err) {
    console.error('Error updating auction statuses:', err);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
updateAuctionStatuses();
setInterval(updateAuctionStatuses, 60000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Socket.io initialized');
});

module.exports = socketModule;
