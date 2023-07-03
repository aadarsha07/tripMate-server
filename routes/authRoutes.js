const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const { registerUser, loginUser } = require('../controllers/authController');

// Register a new user
router.post(
    '/register',
    upload.array('profileImage', 3),
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
        body('gender').notEmpty().withMessage('Gender is required'),
        body('dateOfBirth').notEmpty().withMessage('Date of Birth is required'),
        body('role'),
        body('profileImage')


    ],
    registerUser
);

// Login user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    loginUser
);


module.exports = router;