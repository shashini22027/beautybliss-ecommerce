import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const users = await User.find({});
  console.log("Registered users:");
  users.forEach(u => console.log(`- ${u.name} (${u.email})`));
  process.exit();
}).catch(err => {
  console.error("DB connection error", err);
  process.exit(1);
});
