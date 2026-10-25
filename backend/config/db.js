import mongoose from 'mongoose';

const RETRY_DELAY_MS = 15000;

const connectDB = async () => {
  while (mongoose.connection.readyState !== 1) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautybliss', {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB connection failed (${error.name}).`);
      if (error.name === 'MongooseServerSelectionError') {
        console.error('Check that MongoDB is running and reachable. For MongoDB Atlas, allow this machine IP in Network Access and verify the cluster is available.');
      } else if (error.name === 'MongoServerError' && error.code === 18) {
        console.error('MongoDB authentication failed. Check the database username/password in backend/.env and URL-encode reserved characters in the credentials.');
      } else {
        console.error('Check MONGO_URI in backend/.env. The backend will retry the connection shortly.');
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  return mongoose.connection;
};

export default connectDB;
