const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  profileImage: [
    {
      type: String,
    }
  ],
  token: String,
  role: {
    type: String,
  },
  interest: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
