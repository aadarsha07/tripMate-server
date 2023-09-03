
const express = require('express');
const router = express.Router();


const { verifyUser, unverifyUser,addPopularPlace, getAllPopularPlaces,deletePopularPlace,editPopularPlace} = require('../controllers/adminController');
const upload = require('../middleware/upload');





router.post('/popularPlaces',
    upload.single('image'),
    addPopularPlace);
router.get('/popularPlaces', getAllPopularPlaces);
router.put('/popularPlaces/:id', upload.single('image'), editPopularPlace);
router.delete('/popularPlaces/:id', deletePopularPlace);
router.post('/verifyUser/:id', verifyUser);
router.post('/unverifyUser/:id', unverifyUser);

module.exports = router;
