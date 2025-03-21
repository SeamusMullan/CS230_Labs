import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">CS320 App</h1>
        <p className="home-subtitle">Blah blah blah</p>
      </div>
      
      <p className="home-intro">
      CS230 Lab 3: Building a music library application with React, Axios, Express and MySQL.
      </p>
      
      <div className="card-container">
        <Link to="/artists" className="card-link">
          <div className="card">
            <h2>Artists</h2>
            <p>Add, View, Edit and delete Artists</p>
          </div>
        </Link>
        
        <Link to="/songs" className="card-link">
          <div className="card">
            <h2>Songs</h2>
            <p>Add, View, Edit and delete Songs</p>
          </div>
        </Link>
        
        <Link to="/albums" className="card-link">
          <div className="card">
            <h2>Albums</h2>
            <p>Add, View, Edit and delete Albums</p>
          </div>
        </Link>
      </div>
      
    </div>
  );
};

export default Home;
