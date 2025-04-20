const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded

module.exports = (req, res, next) => {
    try {
        // Get token from header (e.g., "Bearer TOKEN")
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication failed: No token provided or invalid format' });
        }
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info (payload) to request object
        req.user = decoded; // Contains { userId, username, iat, exp }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Authentication failed: Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
             return res.status(401).json({ error: 'Authentication failed: Token expired' });
        }
        return res.status(401).json({ error: 'Authentication failed' });
    }
};
