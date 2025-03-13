import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to MusicCloud</h1>
      <p className="home-intro">
        Explore your favorite artists, discover new songs, and create your music collection.
      </p>
      
      <div className="card-container">
        <Link to="/artists" className="card-link">
          <div className="card">
            <h2>Artists</h2>
            <p>Browse and manage your favorite artists</p>
            <div className="card-icon">👨‍🎤</div>
          </div>
        </Link>
        
        <Link to="/songs" className="card-link">
          <div className="card">
            <h2>Songs</h2>
            <p>Discover and manage your music tracks</p>
            <div className="card-icon">🎵</div>
          </div>
        </Link>
        
        <Link to="/albums" className="card-link">
          <div className="card">
            <h2>Albums</h2>
            <p>Explore and organize albums collection</p>
            <div className="card-icon">💿</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
