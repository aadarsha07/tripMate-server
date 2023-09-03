const User = require('../models/user');
const fs = require('fs');
const Destination = require('../models/destination');
const { validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const path = require('path');
const { profile } = require('console');
const bcrypt = require('bcrypt');
const UserVerification = require('../models/userVerification');

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
    const userId = req.params.id; // Retrieve the user ID from the authenticated user

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

    const { smoker, drinker, aboutMe, language, height, weight, lookingFor } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const languages = req.body.languages;
  

    let updatedFields = {
      smoker,
      drinker,
      aboutMe,
      languages,
      height,
      weight,
      lookingFor,
      profileImage:req.file && req.file.path
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update profile image in destinations where the user is the creator
    await Destination.updateMany(
      { 'addedBy.userId': userId },
      {
        $set: {
          'addedBy.userProfileImage': updatedUser.profileImage,
          
        }
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Change password route
exports.changePassword = async (req, res) => {

  
  try {
    const userId = req.params.id;
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 const { newPassword, confirmPassword } = req.body;
 

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
 const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { password: hash } },
      { new: true }
      );
        
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

}

  

// Email verified

exports.sendEmail = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const userId = req.params.id;
  console.log(userId);
 const email = await User.findById(userId).select('email');
  console.log(email['email']);
  try {
    const user = await User.findByIdAndUpdate(userId);
    user.otp = otp;
    await user.save();
    const nodemailer = require("nodemailer");
    const { google } = require("googleapis");

    async function sendEmail() {
      const OAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      OAuth2Client.setCredentials({
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.AUTH_EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: OAuth2Client.getAccessToken(),
        },
      });

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email['email'],
        subject: "TripMate OTP Verification Email",
        text: `Your OTP to Register in tripMate application is ${otp},
Please do not share this OTP with anyone for security reasons.
OTP will expire in 10 minutes.
        Thank you for using TripMate.
        `,
      };

     
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(otp.toString(), salt);
      const userVerification = await new UserVerification({
        userId: userId,
        otp: hash,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
        

      });
      await userVerification.save();

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    sendEmail();
    return res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
      data: {
        userId: userId,
        email: email['email'],
      }
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while sending OTP' });
  }

}

exports.verifyEmail = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const otp = req.params.otp;
    console.log(otp);
    const userVerificationRecords = await UserVerification.find({ userId: userId });
    if (userVerificationRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const userVerificationRecord = userVerificationRecords[userVerificationRecords.length - 1];
      const {expiresAt} =userVerificationRecord;
      const hash = userVerificationRecord.otp;
      if (Date.now() > expiresAt) {
         await UserVerification.findByIdAndDelete(userVerificationRecord.userId);
        return res.status(400).json({ message: 'OTP expired' });
      } else {
        const isMatch = await bcrypt.compare(otp, hash);
        if (!isMatch) {
          return res.status(400).json({ message: 'OTP incorrect' });
        } else {
          await User.findByIdAndUpdate(userId, { isEmailVerified: true });
          await UserVerification.findByIdAndDelete(userVerificationRecord._id);

          return res.status(200).json({
            status: 'success',
            message: 'Email verified successfully',
            data: {
              userId: userId,
            }
          });
        }
      }
    }

   }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while verifying OTP' });
  }
}






