
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const { generateToken } = require('../utils/tokenGenerator');
const { validationResult } = require('express-validator');

// Register admin

exports.registerAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        let admin = await Admin.findOne({ email });

        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        admin = new Admin({
            email,
            password,
        });
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        savedAdmin = await admin.save();

        const token = generateToken(admin.id);

        res.status(200).json({
            status: 'success',
            message: 'Registered Successfully',
        });


    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Login admin

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'password incorrect' });
        }
        const token = generateToken(admin.id, admin.role);
        res.status(200).json({
            status: 'success',
            message: 'Logged in Successfully',
            token: token,
            role: admin.role

        });


        

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: "Server error"
        });
    }


};



