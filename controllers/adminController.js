
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PopularPlaces = require('../models/popularPlaces');
const { generateToken } = require('../utils/tokenGenerator');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const Destination = require('../models/destination');

exports.addPopularPlace = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        const { name, subTitle, image } = req.body;
        const popularPlaces = new PopularPlaces({
            name,
            subTitle,
            image:req.file.path,
        });
        await popularPlaces.save();
        res.status(200).json({
            status: 'success',
            message: 'Popular place added successfully',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err,
        });
    }
};

exports.getAllPopularPlaces = async (req, res) => {
    try {
        const popularPlaces = await PopularPlaces.find();
        res.status(200).json(popularPlaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err,
        });
    }
};

//edit popular place
exports.editPopularPlace = async (req, res) => {
    // updatePopularPlace PUT method
    try {
        const popularPlaceId = req.params.id;
        const { name, subTitle } = req.body;
        const popularPlace = await PopularPlaces.findById(popularPlaceId);
        if (!popularPlace) {
            return res.status(404).json({ message: 'Popular place not found' });
        }

        // Prepare the update data, including the image if available
        const updateData = {
            name,
            subTitle,
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        // Use findByIdAndUpdate to update the document
        const updatedPopularPlace = await PopularPlaces.findByIdAndUpdate(
            popularPlaceId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Popular place updated successfully',
            updatedPopularPlace,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err,
        });
    }
};

        
//delete popular place
exports.deletePopularPlace = async (req, res) => {
    try {
        const popularPlaceId = req.params.id;

        const popularPlace = await PopularPlaces.findById(popularPlaceId);
        if (!popularPlace) {
            return res.status(404).json({ message: 'Popular place not found' });
        }
        await PopularPlaces.findByIdAndDelete(popularPlaceId);
        res.status(200).json({
            status: 'success',
            message: 'Popular place deleted successfully',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err,
        });
    }
};






//verifyUser
exports.verifyUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const user = User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        await User.findByIdAndUpdate(userId, { isVerified: true });
       

        await Destination.updateMany(
      { 'addedBy.userId': userId }, // Filter to match documents with the specific user
      {
        $set: {
          'addedBy.isVerified': true, // Update addedBy.isVerified to true
          'members.$[elem].isVerified': true // Update members.isVerified to true
        },
      },
      {
        arrayFilters: [{ 'elem.userId': userId }] // Filter for the members array
      }
    );
        res.status(200).json({
            status: 'success',
            message: 'User verified successfully',
        });
        
    }catch(err){
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}

//unveirfyUser
exports.unverifyUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const user = User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        await User.findByIdAndUpdate(userId, { isVerified: false });

      await Destination.updateMany(
      { 'addedBy.userId': userId }, // Filter to match documents with the specific user
      {
        $set: {
          'addedBy.isVerified': false, // Update addedBy.isVerified to true
          'members.$[elem].isVerified': false // Update members.isVerified to true
        },
      },
      {
        arrayFilters: [{ 'elem.userId': userId }] // Filter for the members array
      }
    );
         
        
        res.status(200).json({
            status: 'success',
            message: 'User unverified ',
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}


