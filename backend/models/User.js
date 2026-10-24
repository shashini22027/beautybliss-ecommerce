import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Updated Admin Field
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    addresses: {
      billing: { type: mongoose.Schema.Types.Mixed, default: null },
      shipping: { type: mongoose.Schema.Types.Mixed, default: null },
    },

    savedRoutines: [{
      concernId: { type: String, required: true },
      concernTitle: { type: String, required: true },
      skinType: { type: String, required: true },
      sensitivity: { type: String },
      fragrancePreference: { type: String },
      savedAt: { type: Date, default: Date.now },
    }],

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Password Hash Middleware
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// Password Compare Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
