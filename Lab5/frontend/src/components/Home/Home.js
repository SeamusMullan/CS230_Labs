import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to Your Travel Blog</h1>
                <p>Document your adventures and plan your future journeys.</p>
            </header>

            {isLoggedIn ? (
                <div className="user-info">
                    <h2>Hello, {user?.username}!</h2>
                    <p>What would you like to do today?</p>
                    <div className="home-actions">
                        <Link to="/travel-logs" className="btn btn-home">View My Travel Logs</Link>
                        <Link to="/journey-plans" className="btn btn-home">View My Journey Plans</Link>
                    </div>
                     {/* Optional: Display more profile info */}
                    {/*
                    <div className="profile-details">
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Address:</strong> {user?.address || 'Not provided'}</p>
                    </div>
                    */}
                </div>
            ) : (
                <div className="login-prompt">
                    <p>Please <Link to="/login">login or register</Link> to manage your travel logs and journey plans.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
