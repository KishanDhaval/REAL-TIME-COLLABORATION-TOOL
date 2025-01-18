const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Correct path if needed

const requireSignin = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(401).json({ error: "Authentication token required" });
    }

    const token = authorization.split(" ")[1];
  
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findOne({ _id }).select('_id'); 
        next();
  
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = { requireSignin };


const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (user.role !== 1) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { requireSignin, isAdmin };
