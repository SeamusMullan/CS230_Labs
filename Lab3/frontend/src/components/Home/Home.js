import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Your Music Universe</h1>
        <p className="home-subtitle">Discover, create, and enjoy your personal music collection</p>
      </div>
      
      <p className="home-intro">
        Welcome to MusicCloud, where your musical journey begins. Explore your favorite artists, discover new songs, 
        and organize your collection with our premium music experience.
      </p>
      
      <div className="card-container">
        <Link to="/artists" className="card-link">
          <div className="card">
            <div className="card-icon">👩‍🎤</div>
            <h2>Artists</h2>
            <p>Browse and manage your favorite music creators</p>
          </div>
        </Link>
        
        <Link to="/songs" className="card-link">
          <div className="card">
            <div className="card-icon">🎵</div>
            <h2>Songs</h2>
            <p>Discover and organize your music library</p>
          </div>
        </Link>
        
        <Link to="/albums" className="card-link">
          <div className="card">
            <div className="card-icon">💿</div>
            <h2>Albums</h2>
            <p>Explore complete collections from your favorite artists</p>
          </div>
        </Link>
      </div>
      
      <div className="featured-section">
        <h2>✨ Start Your Musical Journey</h2>
        <p>Create your personal music database and enjoy a premium experience with our Apple Music-inspired interface.</p>
      </div>
    </div>
  );
};

export default Home;
