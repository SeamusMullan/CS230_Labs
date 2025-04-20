import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Define API base URL (consider moving to a config file)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1234/api';

const Login = ({ setIsLoggedIn }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const url = isLoginMode ? `${API_URL}/users/login` : `${API_URL}/users/register`;
    const payload = isLoginMode
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, password: formData.password, email: formData.email, address: formData.address };

    try {
      const response = await axios.post(url, payload);

      if (isLoginMode) {
        // Login successful
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/travel-logs'), 1000); // Redirect after a short delay
      } else {
        // Registration successful
        setSuccessMessage('Registration successful! Please login.');
        setIsLoginMode(true); // Switch to login mode
        // Clear form except username for convenience
        setFormData({
          username: formData.username,
          password: '',
          email: '',
          address: ''
        });
      }
    } catch (err) {
      console.error('Auth error:', err.response || err.message);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">Travel Blog</h1>
        <p className="auth-subtitle">
          {isLoginMode ? 'Login to your account' : 'Create an account'}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={isLoginMode ? undefined : 8}
              autoComplete={isLoginMode ? "current-password" : "new-password"}
            />
            {!isLoginMode && (
              <small className="form-text">Password must be at least 8 characters long</small>
            )}
          </div>

          {!isLoginMode && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address (Optional)</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleInputChange}
                  autoComplete="street-address"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary">
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(''); // Clear errors when switching modes
              setSuccessMessage('');
            }}
          >
            {isLoginMode ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
