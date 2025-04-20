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
        console.log('Connected to MySQL database in client controller');
    }
});

// Get all clients
exports.getAllClients = (req, res) => {
    // Get clients with their sessions count
    const query = `
        SELECT c.*, 
               COUNT(DISTINCT s.id) AS sessions_count,
               COUNT(DISTINCT s.therapist_id) AS therapists_count
        FROM Clients c
        LEFT JOIN Sessions s ON c.id = s.client_id
        GROUP BY c.id
    `;
    
    connection.query(query, (err, clients) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(clients);
    });
};

// Get client by ID
exports.getClientById = (req, res) => {
    const { id } = req.params;
    
    // Get client details
    const query = `
        SELECT c.*, 
               COUNT(DISTINCT s.id) AS sessions_count,
               COUNT(DISTINCT s.therapist_id) AS therapists_count
        FROM Clients c
        LEFT JOIN Sessions s ON c.id = s.client_id
        WHERE c.id = ?
        GROUP BY c.id
    `;
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        const client = results[0];
        
        // Get client's therapists and sessions
        const therapistsQuery = `
            SELECT DISTINCT t.* 
            FROM Therapists t
            JOIN Sessions s ON t.id = s.therapist_id
            WHERE s.client_id = ?
        `;
        
        connection.query(therapistsQuery, [id], (err, therapists) => {
            if (err) {
                console.error('Error getting therapists:', err);
                client.therapists = [];
            } else {
                client.therapists = therapists;
            }
            
            const sessionsQuery = `
                SELECT s.*, t.name as therapist_name 
                FROM Sessions s
                JOIN Therapists t ON s.therapist_id = t.id
                WHERE s.client_id = ?
            `;
            
            connection.query(sessionsQuery, [id], (err, sessions) => {
                if (err) {
                    console.error('Error getting sessions:', err);
                    client.sessions = [];
                } else {
                    client.sessions = sessions;
                }
                
                res.json(client);
            });
        });
    });
};

// Create new client
exports.createClient = (req, res) => {
    const { name, email, phone, appointment_regularity } = req.body;
    
    connection.query(
        'INSERT INTO Clients (name, email, phone, appointment_regularity) VALUES (?, ?, ?, ?)',
        [name, email, phone, appointment_regularity],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            const clientId = result.insertId;
            
            // Return the created client
            connection.query('SELECT * FROM Clients WHERE id = ?', [clientId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                res.status(201).json(results[0]);
            });
        }
    );
};

// Update client
exports.updateClient = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, appointment_regularity } = req.body;
    
    connection.query(
        'UPDATE Clients SET name = ?, email = ?, phone = ?, appointment_regularity = ? WHERE id = ?',
        [name, email, phone, appointment_regularity, id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Client not found' });
            }
            
            connection.query('SELECT * FROM Clients WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                res.json(results[0]);
            });
        }
    );
};

// Delete client
exports.deleteClient = (req, res) => {
    const { id } = req.params;
    
    // With ON DELETE CASCADE in the schema, we can just delete the client
    // and MySQL will automatically remove related sessions
    connection.query('DELETE FROM Clients WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        res.json({ message: 'Client and all related sessions deleted successfully' });
    });
};
