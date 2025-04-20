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

// Get all journey plans for the current user
exports.getAllJourneyPlans = (req, res) => {
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    connection.query(
        'SELECT * FROM JourneyPlans WHERE user_id = ? ORDER BY start_date DESC',
        [req.user.userId],
        (err, results) => {
            if (err) {
                console.error('Database error fetching journey plans:', err);
                return res.status(500).json({ error: 'Failed to fetch journey plans' });
            }

            // Parse JSON fields
            const journeyPlans = results.map(plan => ({
                ...plan,
                locations: plan.locations ? safeJsonParse(plan.locations) : [],
                activities: plan.activities ? safeJsonParse(plan.activities) : []
            }));

            res.json(journeyPlans);
        }
    );
};

// Get single journey plan by ID
exports.getJourneyPlanById = (req, res) => {
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { id } = req.params;

    connection.query(
        'SELECT * FROM JourneyPlans WHERE id = ? AND user_id = ?',
        [id, req.user.userId],
        (err, results) => {
            if (err) {
                console.error('Database error fetching single journey plan:', err);
                return res.status(500).json({ error: 'Failed to fetch journey plan' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Journey plan not found or not owned by user' });
            }

            // Parse JSON fields
            const journeyPlan = {
                ...results[0],
                locations: results[0].locations ? safeJsonParse(results[0].locations) : [],
                activities: results[0].activities ? safeJsonParse(results[0].activities) : []
            };

            res.json(journeyPlan);
        }
    );
};

// Create new journey plan
exports.createJourneyPlan = (req, res) => {
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { name, locations, start_date, end_date, activities, description } = req.body;
    const user_id = req.user.userId;

    if (!name || !start_date || !end_date) {
        return res.status(400).json({ error: 'Name, start date, and end date are required' });
    }

    // Format dates for MySQL
    const formattedStartDate = formatDateForMySQL(start_date);
    const formattedEndDate = formatDateForMySQL(end_date);

    // Convert array fields to JSON strings
    const locationsString = JSON.stringify(Array.isArray(locations) ? locations : []);
    const activitiesString = JSON.stringify(Array.isArray(activities) ? activities : []);

    connection.query(
        'INSERT INTO JourneyPlans (name, locations, start_date, end_date, activities, description, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, locationsString, formattedStartDate, formattedEndDate, activitiesString, description || null, user_id],
        (err, result) => {
            if (err) {
                console.error('Database error creating journey plan:', err);
                return res.status(500).json({ error: 'Failed to create journey plan' });
            }

            // Return the created journey plan
            connection.query(
                'SELECT * FROM JourneyPlans WHERE id = ?',
                [result.insertId],
                (err, results) => {
                    if (err || results.length === 0) {
                        console.error('Database error retrieving created journey plan:', err);
                        return res.status(500).json({ error: 'Failed to retrieve created journey plan' });
                    }

                    // Parse JSON fields
                    const journeyPlan = {
                        ...results[0],
                        locations: results[0].locations ? safeJsonParse(results[0].locations) : [],
                        activities: results[0].activities ? safeJsonParse(results[0].activities) : []
                    };

                    res.status(201).json(journeyPlan);
                }
            );
        }
    );
};

// Update journey plan
exports.updateJourneyPlan = (req, res) => {
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { id } = req.params;
    const { name, locations, start_date, end_date, activities, description } = req.body;

    if (!name || !start_date || !end_date) {
        return res.status(400).json({ error: 'Name, start date, and end date are required' });
    }

    // Format dates for MySQL
    const formattedStartDate = formatDateForMySQL(start_date);
    const formattedEndDate = formatDateForMySQL(end_date);

    // Convert array fields to JSON strings
    const locationsString = JSON.stringify(Array.isArray(locations) ? locations : []);
    const activitiesString = JSON.stringify(Array.isArray(activities) ? activities : []);

    connection.query(
        'UPDATE JourneyPlans SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ? WHERE id = ? AND user_id = ?',
        [name, locationsString, formattedStartDate, formattedEndDate, activitiesString, description || null, id, req.user.userId],
        (err, result) => {
            if (err) {
                console.error('Database error updating journey plan:', err);
                return res.status(500).json({ error: 'Failed to update journey plan' });
            }

             if (result.affectedRows === 0) {
                 return res.status(404).json({ error: 'Journey plan not found or not owned by user' });
            }

            // Return the updated journey plan
            connection.query(
                'SELECT * FROM JourneyPlans WHERE id = ?',
                [id],
                (err, results) => {
                    if (err || results.length === 0) {
                        console.error('Database error retrieving updated journey plan:', err);
                        return res.status(500).json({ error: 'Failed to retrieve updated journey plan' });
                    }

                    // Parse JSON fields
                    const journeyPlan = {
                        ...results[0],
                        locations: results[0].locations ? safeJsonParse(results[0].locations) : [],
                        activities: results[0].activities ? safeJsonParse(results[0].activities) : []
                    };

                    res.json(journeyPlan);
                }
            );
        }
    );
};

// Delete journey plan
exports.deleteJourneyPlan = (req, res) => {
    if (!req.user || !req.user.userId) {
         return res.status(401).json({ error: 'Authentication required' });
    }
    const { id } = req.params;

    connection.query(
        'DELETE FROM JourneyPlans WHERE id = ? AND user_id = ?',
        [id, req.user.userId],
        (err, result) => {
            if (err) {
                console.error('Database error deleting journey plan:', err);
                return res.status(500).json({ error: 'Failed to delete journey plan' });
            }

             if (result.affectedRows === 0) {
                 return res.status(404).json({ error: 'Journey plan not found or not owned by user' });
            }

            res.json({ message: 'Journey plan deleted successfully' });
        }
    );
};
