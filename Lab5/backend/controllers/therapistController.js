const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded

// Create MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Register new user
exports.register = async (req, res) => {
    const { username, password, email, address } = req.body;

    // Validate input
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    // Basic email format validation (can be more robust)
    if (!/\S+@\S+\.\S+/.test(email)) {
         return res.status(400).json({ error: 'Invalid email format' });
    }

    // Hash password with bcrypt
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
            'INSERT INTO Users (username, password, email, address) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, address || null], // Use null if address is not provided
            (err, result) => {
                if (err) {
                    console.error('Database error during registration:', err);
                    // Handle duplicate entry errors
                    if (err.code === 'ER_DUP_ENTRY') {
                        if (err.message.includes('username')) {
                            return res.status(400).json({ error: 'Username already exists' });
                        }
                        if (err.message.includes('email')) {
                             return res.status(400).json({ error: 'Email already exists' });
                        }
                    }
                    return res.status(500).json({ error: 'Registration failed due to server error' });
                }

                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        console.error('Bcrypt error:', error);
        res.status(500).json({ error: 'Registration failed due to server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    connection.query(
        'SELECT * FROM Users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                console.error('Database error during login:', err);
                return res.status(500).json({ error: 'Login failed due to server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const user = results[0];

            // Compare password with stored hash
            try {
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }

                // Create JWT token
                const token = jwt.sign(
                    { userId: user.id, username: user.username },
                    process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env file
                    { expiresIn: '24h' } // Token expires in 24 hours
                );

                // Return user data (excluding password) and token
                const userData = { id: user.id, username: user.username, email: user.email, address: user.address };

                res.json({ user: userData, token });
            } catch (error) {
                console.error('Authentication error:', error);
                res.status(500).json({ error: 'Login failed due to server error' });
            }
        }
    );
};

// Get user profile (requires authentication middleware)
exports.getProfile = (req, res) => {
    // req.user should be populated by the auth middleware
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }

    connection.query(
        'SELECT id, username, email, address FROM Users WHERE id = ?',
        [req.user.userId],
        (err, results) => {
            if (err) {
                console.error('Database error fetching profile:', err);
                return res.status(500).json({ error: 'Failed to get profile' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(results[0]);
        }
    );
};

// Delete all other functions from the old therapistController if any
