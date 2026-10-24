import mongoose from 'mongoose';

const RETRY_DELAY_MS = 15000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautybliss', {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed (${error.name}).`);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Check that MongoDB is running and reachable. For MongoDB Atlas, allow this machine IP in Network Access and verify the cluster is available.');
    } else if (error.name === 'MongoServerError' && error.code === 18) {
      console.error('MongoDB authentication failed. Check the database username/password in backend/.env and URL-encode reserved characters in the credentials.');
    } else {
      console.error('Check MONGO_URI in backend/.env. The backend will retry the database connection shortly.');
    }

    const retryTimer = setTimeout(connectDB, RETRY_DELAY_MS);
    retryTimer.unref();
  }
};

export default connectDB;
