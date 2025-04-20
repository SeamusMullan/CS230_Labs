const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database in therapist controller');
    }
});

// Get all therapists
exports.getAllTherapists = (req, res) => {
    // Get therapists with their sessions count
    const query = `
        SELECT t.*, 
               COUNT(DISTINCT s.id) AS sessions_count, 
               COUNT(DISTINCT s.client_id) AS client_count
        FROM Therapists t
        LEFT JOIN Sessions s ON t.id = s.therapist_id
        GROUP BY t.id
    `;
    
    connection.query(query, (err, therapists) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(therapists);
    });
};

// Get therapist by ID
exports.getTherapistById = (req, res) => {
    const { id } = req.params;
    
    // Get therapist details
    const query = `
        SELECT t.*, 
               COUNT(DISTINCT s.id) AS sessions_count, 
               COUNT(DISTINCT s.client_id) AS client_count
        FROM Therapists t
        LEFT JOIN Sessions s ON t.id = s.therapist_id
        WHERE t.id = ?
        GROUP BY t.id
    `;
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Therapist not found' });
        }
        
        const therapist = results[0];
        
        // Get therapist's clients and sessions
        const clientsQuery = `
            SELECT DISTINCT c.* 
            FROM Clients c
            JOIN Sessions s ON c.id = s.client_id
            WHERE s.therapist_id = ?
        `;
        
        connection.query(clientsQuery, [id], (err, clients) => {
            if (err) {
                console.error('Error getting clients:', err);
                therapist.clients = [];
            } else {
                therapist.clients = clients;
            }
            
            const sessionsQuery = `
                SELECT s.*, c.name as client_name 
                FROM Sessions s
                JOIN Clients c ON s.client_id = c.id
                WHERE s.therapist_id = ?
            `;
            
            connection.query(sessionsQuery, [id], (err, sessions) => {
                if (err) {
                    console.error('Error getting sessions:', err);
                    therapist.sessions = [];
                } else {
                    therapist.sessions = sessions;
                }
                
                res.json(therapist);
            });
        });
    });
};

// Create new therapist
exports.createTherapist = (req, res) => {
    const { title, name, email, location, years_practice, availability } = req.body;
    
    connection.query(
        'INSERT INTO Therapists (title, name, email, location, years_practice, availability) VALUES (?, ?, ?, ?, ?, ?)',
        [title, name, email, location, years_practice, availability],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            const therapistId = result.insertId;
            
            // Return the created therapist
            connection.query('SELECT * FROM Therapists WHERE id = ?', [therapistId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                res.status(201).json(results[0]);
            });
        }
    );
};

// Update therapist
exports.updateTherapist = (req, res) => {
    const { id } = req.params;
    const { title, name, email, location, years_practice, availability } = req.body;
    
    connection.query(
        'UPDATE Therapists SET title = ?, name = ?, email = ?, location = ?, years_practice = ?, availability = ? WHERE id = ?',
        [title, name, email, location, years_practice, availability, id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Therapist not found' });
            }
            
            connection.query('SELECT * FROM Therapists WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                res.json(results[0]);
            });
        }
    );
};

// Delete therapist
exports.deleteTherapist = (req, res) => {
    const { id } = req.params;
    
    // With ON DELETE CASCADE in the schema, we can just delete the therapist
    // and MySQL will automatically remove related sessions
    connection.query('DELETE FROM Therapists WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Therapist not found' });
        }
        
        res.json({ message: 'Therapist and all related sessions deleted successfully' });
    });
};
