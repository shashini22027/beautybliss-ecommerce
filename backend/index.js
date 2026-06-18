import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import apiLimiter from './middleware/rateLimiter.js';

import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/', apiLimiter);

// 🔍 DATABASE TEST ROUTE (ප්‍රශ්නය හඳුනාගැනීම සඳහා අලුතින් එකතු කරන ලදී)
app.get('/api/test-db', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const statusMap = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };

    if (dbStatus !== 1) {
      return res.status(500).json({ 
        status: statusMap[dbStatus], 
        message: "Database is not fully connected yet." 
      });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    res.json({
      status: statusMap[dbStatus],
      databaseName: mongoose.connection.db.databaseName,
      message: "Database connected successfully!",
      collections: collectionNames
    });
  } catch (err) {
    res.status(500).json({ 
      status: "Error", 
      message: "Failed to fetch collections", 
      error: err.message 
    });
  }
});

// Regular API Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);

// Serve uploads static directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));