import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautybliss');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Server is running, but database connection could not be established. Please verify your local MongoDB service status or paste a valid MONGO_URI in backend/.env');
  }
};

export default connectDB;
