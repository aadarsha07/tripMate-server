const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateToken = (id, role) => {
    const payload = {
        id: id,
        role: role,
    };
    const options = {
        expiresIn: process.env.JWT_EXPIRATION,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = { generateToken };