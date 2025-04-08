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
        console.log('Connected to MySQL database in session controller');
    }
});

// Get all sessions
exports.getAllSessions = (req, res) => {
    // Join with therapists and clients to get their names
    const query = `
        SELECT s.*, 
               t.name as therapist_name, 
               c.name as client_name
        FROM Sessions s
        LEFT JOIN Therapists t ON s.therapist_id = t.id
        LEFT JOIN Clients c ON s.client_id = c.id
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

// Get session by ID
exports.getSessionById = (req, res) => {
    const { id } = req.params;
    
    // Join with therapists and clients to get their names
    const query = `
        SELECT s.*, 
               t.name as therapist_name, 
               c.name as client_name
        FROM Sessions s
        LEFT JOIN Therapists t ON s.therapist_id = t.id
        LEFT JOIN Clients c ON s.client_id = c.id
        WHERE s.id = ?
    `;
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json(results[0]);
    });
};

// Create new session
exports.createSession = (req, res) => {
    const { therapist_id, client_id, notes, session_date, session_length } = req.body;
    
    // Validate therapist and client existence
    connection.query(
        'SELECT id FROM Therapists WHERE id = ?', 
        [therapist_id], 
        (err, therapistResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (therapistResults.length === 0) {
                return res.status(400).json({ error: 'Therapist not found' });
            }
            
            connection.query(
                'SELECT id FROM Clients WHERE id = ?', 
                [client_id], 
                (err, clientResults) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    if (clientResults.length === 0) {
                        return res.status(400).json({ error: 'Client not found' });
                    }
                    
                    // Create the session
                    connection.query(
                        'INSERT INTO Sessions (therapist_id, client_id, notes, session_date, session_length) VALUES (?, ?, ?, ?, ?)',
                        [therapist_id, client_id, notes, session_date, session_length],
                        (err, result) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            
                            // Get the created session with therapist and client details
                            const query = `
                                SELECT s.*, 
                                       t.name as therapist_name, 
                                       c.name as client_name
                                FROM Sessions s
                                LEFT JOIN Therapists t ON s.therapist_id = t.id
                                LEFT JOIN Clients c ON s.client_id = c.id
                                WHERE s.id = ?
                            `;
                            
                            connection.query(query, [result.insertId], (err, results) => {
                                if (err) {
                                    console.error('Database error:', err);
                                    return res.status(500).json({ error: 'Internal server error' });
                                }
                                res.status(201).json(results[0]);
                            });
                        }
                    );
                }
            );
        }
    );
};

// Update session
exports.updateSession = (req, res) => {
    const { id } = req.params;
    const { therapist_id, client_id, notes, session_date, session_length } = req.body;
    
    // Validate therapist and client existence
    connection.query(
        'SELECT id FROM Therapists WHERE id = ?', 
        [therapist_id], 
        (err, therapistResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (therapistResults.length === 0) {
                return res.status(400).json({ error: 'Therapist not found' });
            }
            
            connection.query(
                'SELECT id FROM Clients WHERE id = ?', 
                [client_id], 
                (err, clientResults) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    if (clientResults.length === 0) {
                        return res.status(400).json({ error: 'Client not found' });
                    }
                    
                    // Update the session
                    connection.query(
                        'UPDATE Sessions SET therapist_id = ?, client_id = ?, notes = ?, session_date = ?, session_length = ? WHERE id = ?',
                        [therapist_id, client_id, notes, session_date, session_length, id],
                        (err, result) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            
                            if (result.affectedRows === 0) {
                                return res.status(404).json({ error: 'Session not found' });
                            }
                            
                            // Get the updated session with therapist and client details
                            const query = `
                                SELECT s.*, 
                                       t.name as therapist_name, 
                                       c.name as client_name
                                FROM Sessions s
                                LEFT JOIN Therapists t ON s.therapist_id = t.id
                                LEFT JOIN Clients c ON s.client_id = c.id
                                WHERE s.id = ?
                            `;
                            
                            connection.query(query, [id], (err, results) => {
                                if (err) {
                                    console.error('Database error:', err);
                                    return res.status(500).json({ error: 'Internal server error' });
                                }
                                res.json(results[0]);
                            });
                        }
                    );
                }
            );
        }
    );
};

// Delete session
exports.deleteSession = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM Sessions WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json({ message: 'Session deleted successfully' });
    });
};
