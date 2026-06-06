import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import sendEmail from './utils/sendEmail.js';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const email = 'indranisubasingha455@gmail.com';
  const user = await User.findOne({
    $or: [{ email }, { name: email }],
  });
  
  if (!user) {
    console.log("USER NOT FOUND IN DB. THIS IS WHY EMAIL IS NOT SENT.");
  } else {
    console.log("USER FOUND:", user.email);
    console.log("Sending email...");
    try {
      await sendEmail({
        to: user.email,
        subject: 'Test forgotPassword flow',
        html: 'This is a test from the exact logic.'
      });
      console.log("SUCCESS");
    } catch(err) {
      console.error("ERROR SENDING", err);
    }
  }
  process.exit();
}).catch(err => {
  console.error("DB error", err);
  process.exit(1);
});
