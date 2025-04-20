const mysql = require('mysql');
require('dotenv').config({ path: '../.env' });

// Create MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Helper to parse JSON safely
const safeJsonParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return []; // Return empty array or handle error as appropriate
    }
};

// Format date to YYYY-MM-DD for MySQL
const formatDateForMySQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extract just the YYYY-MM-DD part
};

// Get all travel logs for the current user
exports.getAllTravelLogs = (req, res) => {
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    connection.query(
        'SELECT * FROM TravelLogs WHERE user_id = ? ORDER BY post_date DESC',
        [req.user.userId],
        (err, results) => {
            if (err) {
                console.error('Database error fetching travel logs:', err);
                return res.status(500).json({ error: 'Failed to fetch travel logs' });
            }

            // Parse tags from JSON string to array
            const travelLogs = results.map(log => ({
                ...log,
                tags: log.tags ? safeJsonParse(log.tags) : []
            }));

            res.json(travelLogs);
        }
    );
};

// Get single travel log by ID
exports.getTravelLogById = (req, res) => {
     if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { id } = req.params;

    connection.query(
        'SELECT * FROM TravelLogs WHERE id = ? AND user_id = ?',
        [id, req.user.userId],
        (err, results) => {
            if (err) {
                console.error('Database error fetching single travel log:', err);
                return res.status(500).json({ error: 'Failed to fetch travel log' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Travel log not found or not owned by user' });
            }

            // Parse tags from JSON string to array
            const travelLog = {
                ...results[0],
                tags: results[0].tags ? safeJsonParse(results[0].tags) : []
            };

            res.json(travelLog);
        }
    );
};

// Create new travel log
exports.createTravelLog = (req, res) => {
     if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { title, description, start_date, end_date, tags } = req.body;
    const post_date = new Date().toISOString().split('T')[0]; // Current date formatted for MySQL
    const user_id = req.user.userId;

    if (!title || !start_date || !end_date) {
        return res.status(400).json({ error: 'Title, start date, and end date are required' });
    }

    // Format dates for MySQL
    const formattedStartDate = formatDateForMySQL(start_date);
    const formattedEndDate = formatDateForMySQL(end_date);

    // Convert tags array to JSON string (ensure it's an array)
    const tagsString = JSON.stringify(Array.isArray(tags) ? tags : []);

    connection.query(
        'INSERT INTO TravelLogs (title, description, start_date, end_date, post_date, tags, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description || null, formattedStartDate, formattedEndDate, post_date, tagsString, user_id],
        (err, result) => {
            if (err) {
                console.error('Database error creating travel log:', err);
                return res.status(500).json({ error: 'Failed to create travel log' });
            }

            // Return the created travel log
            connection.query(
                'SELECT * FROM TravelLogs WHERE id = ?',
                [result.insertId],
                (err, results) => {
                    if (err || results.length === 0) {
                        console.error('Database error retrieving created travel log:', err);
                        // Even if retrieval fails, the log was created, so maybe return 201 with ID?
                        return res.status(500).json({ error: 'Failed to retrieve created travel log, but creation might have succeeded.' });
                    }

                    // Parse tags from JSON string to array
                    const travelLog = {
                        ...results[0],
                        tags: results[0].tags ? safeJsonParse(results[0].tags) : []
                    };

                    res.status(201).json(travelLog);
                }
            );
        }
    );
};

// Update travel log
exports.updateTravelLog = (req, res) => {
     if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { id } = req.params;
    const { title, description, start_date, end_date, tags } = req.body;

     if (!title || !start_date || !end_date) {
        return res.status(400).json({ error: 'Title, start date, and end date are required' });
    }

    // Format dates for MySQL
    const formattedStartDate = formatDateForMySQL(start_date);
    const formattedEndDate = formatDateForMySQL(end_date);

    // Convert tags array to JSON string
    const tagsString = JSON.stringify(Array.isArray(tags) ? tags : []);

    // Update the travel log - ownership is implicitly checked by user_id in WHERE clause
    connection.query(
        'UPDATE TravelLogs SET title = ?, description = ?, start_date = ?, end_date = ?, tags = ? WHERE id = ? AND user_id = ?',
        [title, description || null, formattedStartDate, formattedEndDate, tagsString, id, req.user.userId],
        (err, result) => {
            if (err) {
                console.error('Database error updating travel log:', err);
                return res.status(500).json({ error: 'Failed to update travel log' });
            }

            if (result.affectedRows === 0) {
                 return res.status(404).json({ error: 'Travel log not found or not owned by user' });
            }

            // Return the updated travel log
            connection.query(
                'SELECT * FROM TravelLogs WHERE id = ?',
                [id],
                (err, results) => {
                    if (err || results.length === 0) {
                        console.error('Database error retrieving updated travel log:', err);
                        return res.status(500).json({ error: 'Failed to retrieve updated travel log' });
                    }

                    // Parse tags from JSON string to array
                    const travelLog = {
                        ...results[0],
                        tags: results[0].tags ? safeJsonParse(results[0].tags) : []
                    };

                    res.json(travelLog);
                }
            );
        }
    );
};

// Delete travel log
exports.deleteTravelLog = (req, res) => {
     if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { id } = req.params;

    connection.query(
        'DELETE FROM TravelLogs WHERE id = ? AND user_id = ?',
        [id, req.user.userId],
        (err, result) => {
            if (err) {
                console.error('Database error deleting travel log:', err);
                return res.status(500).json({ error: 'Failed to delete travel log' });
            }

            if (result.affectedRows === 0) {
                 return res.status(404).json({ error: 'Travel log not found or not owned by user' });
            }

            res.json({ message: 'Travel log deleted successfully' });
        }
    );
};
