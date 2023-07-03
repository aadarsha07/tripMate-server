const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err.message);
        res.sendStatus(403);
    }
}

module.exports = {
    authenticateToken
};
