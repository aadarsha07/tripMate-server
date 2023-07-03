const User = require('../models/user');
const Destination = require('../models/destination');
const { validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const path = require('path');
const { profile } = require('console');
const bcrypt = require('bcrypt');

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get destinations added by a user
exports.getDestinationsByUser = async (req, res) => {
  try {
    const destinations = await Destination.find({ 'addedBy.userId': req.params.id });
    if (destinations.length === 0) {
      return res.status(404).json({ msg: 'No destinations found for this user' });
    }

    res.status(200).json(destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
//get all joined destinations
exports.getJoinedDestinations = async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the authenticated user

    // Find destinations where the user is a member
    const destinations = await Destination.find({ 'members.userId': userId });

    res.status(200).json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find();
    res.status(200).json(users);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const { dateOfBirth } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profileImage: req.files.map(file => file.path), dateOfBirth } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update profile image in destinations where the user is the creator
    await Destination.updateMany(
      { 'addedBy.userId': userId },
      { $set: { 'addedBy.userProfileImage': updatedUser.profileImage } }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Change password route



exports.changePassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Retrieve the user from the database
    const user = await User.findByIdAndUpdate(userId);
    // Verify that the entered current password matches the one stored in the database
    // const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    // if (!passwordsMatch) {
    //   return res.status(401).json({ message: 'Current password is incorrect' });
    // }
    // Verify that the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }
    // Generate a bcrypt hash for the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Update the user's password in the database with the new bcrypt hash

    await user.save();
    // Password changed successfully
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while changing the password' });
  }
};






