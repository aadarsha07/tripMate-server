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
        const { firstName, lastName, email, password, gender, dateOfBirth, role,height ,weight,qualification,state,city,maritalStatus,isEmailVerified,languages} = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const interests = req.body.interests;

        const profileImage = req.file && req.file.path;
        user = new User({
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth,
            role,
            height,
            languages,
            weight,
            qualification,
            city,
            state,
            maritalStatus,
            profileImage,
            interests,
            isEmailVerified,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        savedUser = await user.save();

        const token = generateToken(user.id);

        res.status(200).json({
            status: 'success',
            message: 'Registered Successfully',
            id: user._id,
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
            status: 'success',
            message : 'LoggedIn Successfully',
            token: token,
            userId: user._id,
            role: user.role,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            otp: user.otp,
    
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        })
            ;
    }
};
