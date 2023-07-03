const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateToken } = require('../utils/tokenGenerator');
const { validationResult } = require('express-validator');
// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { firstName, lastName, email, password, gender, dateOfBirth, role } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }


        user = new User({
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth,
            role,
            profileImage: req.files.map(file => file.path)
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        savedUser = await user.save();

        const token = generateToken(user.id);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            gender: user.gender,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
            dateOfBirth: user.dateOfBirth,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password incorrect' });
        }

        const token = generateToken(user._id, user.role);
        user.token = token;
        user.save();

        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            gender: user.gender,
            firstName: user.firstName,
            lastName: user.lastName,
            token: token,
            profileImage: user.profileImage,
            dateOfBirth: user.dateOfBirth,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        })
            ;
    }
};
