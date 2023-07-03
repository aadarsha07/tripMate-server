const User = require('../models/user');
const { validationResult } = require('express-validator');
const upload = require("../middleware/upload");
const path = require('path');
const generateToken = require('../utils/tokenGenerator');
const Destination = require('../models/destination');


// Add a new destination
exports.addDestination = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, startDate, endDate, peopleLooking } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const destination = new Destination({
            name,
            description,
            startDate,
            endDate,
            peopleLooking,
            placeImage: req.file.path,
            // purpose,
            addedBy: {
                userId: req.userId,
                userName: `${user.firstName} ${user.lastName}`,
                userProfileImage: user.profileImage// Add user's profile image
            },
        });

        await destination.save();

        res.status(200).json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err
        });
    }
};

// Get all destinations
exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a destination by ID
exports.getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ msg: 'Destination not found' });
        }

        res.status(200).json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a destination
exports.updateDestination = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, description, startDate, endDate, peopleLooking } = req.body;

        let destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ msg: 'Destination not found' });
        }
        destination.name = name;
        destination.description = description;
        destination.startDate = startDate;
        destination.endDate = endDate;
        destination.peopleLooking = peopleLooking;

        if (req.file) {
            destination.placeImage = req.file.path;
        }
        await destination.save();

        res.status(200).json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a destination
exports.deleteDestination = async (req, res) => {
    try {
        let destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        await Destination.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: 'Destination removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
//join destination
exports.joinDestination = async (req, res) => {
    try {
        const destinationId = req.params.destinationId;
        const userId = req.userId; // Retrieve the user ID from the authenticated user
        const user = await User.findById(userId);
        const userName = `${user.firstName} ${user.lastName}`;
        const memberProfileImage = user.profileImage;

        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const existingMember = destination.members.find(
            (member) => member.userId.toString() === userId
        );
        if (existingMember) {
            return res.status(409).json({ message: 'You already requested to join this trip' });
        }
        const newMember = {
            userId,
            userName,
            status: 'Pending',
            memberDateOfBirth: user.dateOfBirth,
            memberProfileImage,

        };
        destination.members.push(newMember);
        await destination.save();

        res.status(200).json({
            destination,
            message: 'Sent request to join'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//accept user
exports.acceptTheUser = async (req, res) => {
    try {
        const destinationId = req.params.destinationId;
        const userId = req.params.userId;

        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        const member = destination.members.find(
            (member) => member.userId.toString() === userId
        );
        if (!member) {
            return res.status(404).json({ message: 'User not found in destination' });
        }
        if (member.status === 'Accepted') {
            return res.status(409).json({ message: 'User is already accepted' });
        }

        member.status = 'Accepted';
        await destination.save();

        res.status(200).json({ message: 'User accepted in the destination' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//delete member
exports.deleteMember = async (req, res) => {
    try {
        const destinationId = req.params.destinationId;
        const userId = req.params.userId;

        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const memberIndex = destination.members.findIndex(
            (member) => member.userId.toString() === userId
        );
        if (memberIndex === -1) {
            return res.status(404).json({ message: 'User not found in destination' });
        }

        destination.members.splice(memberIndex, 1);
        await destination.save();

        res.status(200).json({ message: 'Member removed from destination' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


