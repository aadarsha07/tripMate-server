const jwt = require('jsonwebtoken');

const tripAdd = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            const userId = decodedToken.id
            const userRole = decodedToken.role

            if (userRole == "user") {
                req.userId = userId;
                next();
            }
            else if(userRole == "admin"){
                req.userId = userId;
                next();
            
                
            }
            ;
        }
    })


};

module.exports = tripAdd;