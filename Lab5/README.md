# Travel Blog Application

A full-stack application for managing travel logs and journey plans. Users can register, log in, and maintain their personal collection of travel memories and future trip plans.

## Features

- User authentication with secure password hashing using bcrypt
- Personal travel logs with dates, descriptions, and tags
- Journey plans with locations, dates, activities, and descriptions
- Full CRUD operations for both travel logs and journey plans
- Responsive UI for a seamless experience across devices

## Technologies Used

- **Frontend**: React, React Router, Axios, CSS
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT, bcrypt

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MySQL installed and running

### Database Setup

1. Create a MySQL database named `travel_blog` (or your preferred name)
2. In the backend directory, copy `.env.sample` to a new file named `.env`:
   ```
   cp .env.sample .env
   ```
3. Update the `.env` file with your MySQL credentials and other settings
4. Run the database setup script to create the tables:
   ```
   cd backend
   node db/dbSetup.js
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   or with nodemon for development:
   ```
   npx nodemon server.js
   ```
4. The server should now be running on port 1234 (or the port specified in your .env file)

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Copy `.env.sample` to a new file named `.env`:
   ```
   cp .env.sample .env
   ```
3. Update the `.env` file if needed (default should work if backend is on port 1234)
4. Install dependencies:
   ```
   npm install
   ```
5. Start the React development server:
   ```
   npm start
   ```
6. The application should now be running at http://localhost:3000

## Usage

1. Register a new account using the registration form
2. Log in with your credentials
3. Add, view, edit, and delete your travel logs and journey plans
4. Log out when finished

## Project Structure

- `/backend` - Express.js server and API
  - `/controllers` - Business logic for users, travel logs, and journey plans
  - `/routes` - API route definitions
  - `/middleware` - Authentication middleware
  - `/db` - Database setup and schema
- `/frontend` - React application
  - `/src/components` - React components
    - `/Auth` - Authentication components
    - `/Home` - Home page component
    - `/TravelLogs` - Travel logs CRUD components
    - `/JourneyPlans` - Journey plans CRUD components
    - `/Navigation` - Navigation bar component

## Security Notes

- JWT token is stored in localStorage - consider implementing HTTP-only cookies for enhanced security in a production environment
- Ensure you change the JWT_SECRET in the .env file for production
- Password requirements enforced with minimum length of 8 characters