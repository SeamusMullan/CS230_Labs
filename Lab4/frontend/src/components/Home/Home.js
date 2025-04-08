import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">CS320 Lab</h1>
        <p className="home-subtitle">Therapist-Client Management System</p>
      </div>
      
      <p className="home-intro">
        Blah blah blah blah some crap goes here.
      </p>
      
      <div className="card-container">
        <Link to="/therapists" className="card-link">
          <div className="card">
            <div className="feature-icon">👩‍⚕️</div>
            <h2>Therapists</h2>
            <p>Add, view, edit, and manage therapist profiles and information.</p>
            <button className="btn btn-primary">Manage Therapists</button>
          </div>
        </Link>
        
        <Link to="/clients" className="card-link">
          <div className="card">
            <div className="feature-icon">👤</div>
            <h2>Clients</h2>
            <p>Keep track of client information, treatment history, and assigned therapists.</p>
            <button className="btn btn-primary">Manage Clients</button>
          </div>
        </Link>
        
        <Link to="/appointments" className="card-link">
          <div className="card">
            <div className="feature-icon">📅</div>
            <h2>Appointments</h2>
            <p>Schedule and organize therapy appointments, sessions, and follow-ups.</p>
            <button className="btn btn-primary">Manage Appointments</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
