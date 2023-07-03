const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require("../middleware/upload");
const {
    addDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination,
    joinDestination,
    acceptTheUser,
    deleteMember
} = require('../controllers/destinationController');

const { authenticateToken } = require('../middleware/authMiddleware');
const tripAdd = require('../middleware/tripAdd');



// Add a new destination    
router.post(
    '/',
    tripAdd,
    upload.single('placeImage'),
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('startDate').notEmpty().withMessage('Start date is required'),
        body('endDate').notEmpty().withMessage('End date is required'),
        body('peopleLooking').notEmpty().withMessage('peopleLooking is required'),


    ],
    addDestination
);

// Get all destinations
router.get('/', tripAdd, getAllDestinations);

// Get a destination by ID
router.get('/:id', tripAdd, getDestinationById);

// Update a destination
router.put(
    '/:id',
    tripAdd,
    upload.single('placeImage'),
    [

        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('startDate').notEmpty().withMessage('Start date is required'),
        body('endDate').notEmpty().withMessage('End date is required'),

    ],
    updateDestination
);

// Delete a destination
router.delete('/:id', tripAdd, deleteDestination);
//join destination
router.post('/:destinationId/join', tripAdd, joinDestination);
router.put('/:destinationId/accept/:userId', acceptTheUser);
router.delete('/:destinationId/member/:userId', deleteMember);

module.exports = router;
