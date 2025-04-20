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
    const dropUsers = `DROP TABLE IF EXISTS Users`;
    const dropTravelLogs = `DROP TABLE IF EXISTS TravelLogs`;
    const dropJourneyPlans = `DROP TABLE IF EXISTS JourneyPlans`; 

    // Create Users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            
        )
    `;
    
    // Create TravelLogs table
    const createTravelLogsTable = `
        CREATE TABLE IF NOT EXISTS TravelLogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            
        )
    `;
    
    // Create JourneyPlan table
    const createJourneyPlanTable = `
        CREATE TABLE IF NOT EXISTS JourneyPlans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            
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
