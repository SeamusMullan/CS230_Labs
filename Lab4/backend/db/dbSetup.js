const mysql = require('mysql');
require('dotenv').config({ path: '../.env' });

// Create connection for database setup
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Create tables
    createTables();
});

// Create all necessary tables
function createTables() {

    // if any table exists, drop it first
    const dropSessions = `DROP TABLE IF EXISTS Sessions`;
    const dropClients = `DROP TABLE IF EXISTS Clients`;
    const dropTherapists = `DROP TABLE IF EXISTS Therapists`; 

    // Create Therapists table
    const createTherapistsTable = `
        CREATE TABLE IF NOT EXISTS Therapists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            years_practice INT NOT NULL,
            availability ENUM('TAKING CLIENTS', 'NOT TAKING CLIENTS') NOT NULL
        )
    `;
    
    // Create Clients table
    const createClientsTable = `
        CREATE TABLE IF NOT EXISTS Clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            appointment_regularity ENUM('WEEKLY', 'MONTHLY') NOT NULL
        )
    `;
    
    // Create Sessions table
    const createSessionsTable = `
        CREATE TABLE IF NOT EXISTS Sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            therapist_id INT,
            client_id INT,
            notes TEXT,
            session_date DATE NOT NULL,
            session_length INT NOT NULL,
            FOREIGN KEY (therapist_id) REFERENCES Therapists(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES Clients(id) ON DELETE CASCADE
        )
    `;

    connection.query(dropSessions, (err) => {
        if (err) {
            console.error("Error Deleting Existing Table 'Sessions':", err);
            return;
        }
        console.log('Deleted Existing Tables for Sessions');
    });

    connection.query(dropClients, (err) => {
        if (err) {
            console.error("Error Deleting Existing Table 'Clients':", err);
            return;
        }
        console.log('Deleted Existing Tables for Clients');
    });

    connection.query(dropTherapists, (err) => {
        if (err) {
            console.error("Error Deleting Existing Table 'Therapists':", err);
            return;
        }
        console.log('Deleted Existing Tables for Therapists');
    });
    
    // Execute queries
    connection.query(createTherapistsTable, (err) => {
        if (err) {
            console.error('Error creating Therapists table:', err);
            return;
        }
        console.log('Therapists table created or already exists');
        
        connection.query(createClientsTable, (err) => {
            if (err) {
                console.error('Error creating Clients table:', err);
                return;
            }
            console.log('Clients table created or already exists');
            
            connection.query(createSessionsTable, (err) => {
                if (err) {
                    console.error('Error creating Sessions table:', err);
                    return;
                }
                console.log('Sessions table created or already exists');
                
                // Close connection after all tables are created
                connection.end();
            });
        });
    });
}
