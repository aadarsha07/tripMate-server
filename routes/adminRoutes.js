
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../middleware/upload');

const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// Register a new admin

router.post(
    '/register',
    upload.array('profileImage', 3),
    [
        body('email').isEmail().withMessage('Invalid email'),

        body('password').notEmpty().withMessage('Password is required'),
        body('role'),
    ],
    registerAdmin
);

// Login admin

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],  
    loginAdmin
);

module.exports = router;
