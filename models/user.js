const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
  },
  isEmailVerified: {
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
  profileImage: 
    {
      type: String,
    }
  ,
  token: String,
  role: {
    type: String,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  qualification: {
    type: String,
  },
  city: { type: String },
  state: { type: String },
  maritalStatus: { type: String },
  interests: [{
    type: String
  }],
  aboutMe: { type: String },
  lookingFor: { type: String },
  languages: [{
    type: String
  }],
  smoker: { type: String },
  drinker: { type: String },

});

module.exports = mongoose.model('User', userSchema);
