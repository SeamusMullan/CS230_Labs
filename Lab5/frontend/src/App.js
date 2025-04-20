import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Import Components
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import TravelLogs from './components/TravelLogs/TravelLogs';
import JourneyPlans from './components/JourneyPlans/JourneyPlans';
import Navigation from './components/Navigation/Navigation';

// Protected Route Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  let location = useLocation();

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Optional: Add token validation here (e.g., decode and check expiry)
      setIsLoggedIn(true);
    }
    setIsLoading(false); // Finished checking auth status
  }, []);

  // Show loading indicator while checking auth status
  if (isLoading) {
    return <div className="loading-app">Loading Application...</div>; // Or a spinner component
  }

  return (
    <Router>
      <div className="App">
        {/* Navigation always visible */}
        <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <main className="App-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

            {/* Protected Routes */}
            <Route
              path="/travel-logs"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <TravelLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journey-plans"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <JourneyPlans />
                </ProtectedRoute>
              }
            />

            {/* Optional: Redirect any unknown paths to Home or a 404 page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>CS230 Assignment 5 - Travel Blog Application</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
