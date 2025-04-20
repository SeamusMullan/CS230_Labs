import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Get user info for display

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="app-nav">
            <Link to="/" className="nav-brand">Travel Blog</Link>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/travel-logs">My Logs</Link></li>
                        <li><Link to="/journey-plans">My Plans</Link></li>
                        <li className="nav-user">Welcome, {user?.username}!</li>
                        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login / Register</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
