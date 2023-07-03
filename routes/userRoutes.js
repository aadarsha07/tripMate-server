const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const upload = require('../middleware/upload')
const {
    getUserById,
    getDestinationsByUser,
    getAllUsers,
    updateUserById,
    changePassword,
    getJoinedDestinations

} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const tripAdd = require('../middleware/tripAdd');

// Get user by ID
router.get('/:id', tripAdd, getUserById);

// Get destinations added by a user
router.get('/:id/destinations', tripAdd, getDestinationsByUser);

// Get all users
router.get('/', tripAdd, getAllUsers);
router.get('/destinations/joined', tripAdd, getJoinedDestinations);

// Update user by ID
router.put(
    '/:id', tripAdd, upload.array('profileImage', 3),
    [
        // check('firstName', 'First name is required').notEmpty(),
        // check('lastName', 'Last name is required').notEmpty(),
        // check('email', 'Please include a valid email').isEmail(),


    ],
    updateUserById
);
router.put('/:id/changepassword', tripAdd, changePassword);


// router.post('/:id/photo', authenticateToken, upload.single('profileImage'), uploadPhoto);




module.exports = router;

