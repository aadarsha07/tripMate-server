// routes/recommendUserRoutes.js

const express = require('express');
const recommendUserController = require('../controllers/recommendUserController');

const router = express.Router();

// Define route for getting recommended users with destinations
router.get('/:userId', recommendUserController.getRecommendedUsersWithDestinations);

module.exports = router;
