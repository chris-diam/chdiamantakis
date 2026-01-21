import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not using Google OAuth
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  character: {
    skinColor: { type: Number, default: 0 },
    hairStyle: { type: Number, default: 0 },
    hairColor: { type: Number, default: 0 },
    shirtColor: { type: Number, default: 0 },
    pantsColor: { type: Number, default: 0 },
    hatStyle: { type: Number, default: -1 }, // -1 = no hat
  },
  lastPosition: {
    x: { type: Number, default: 400 },
    y: { type: Number, default: 300 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Return user data without sensitive info
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    character: this.character,
    lastPosition: this.lastPosition,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
