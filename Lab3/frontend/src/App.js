import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Songs from './components/Songs/Songs';
import Artists from './components/Artists/Artists';
import Albums from './components/Albums/Albums';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>✨ MusicCloud</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/artists">Artists</Link></li>
              <li><Link to="/songs">Songs</Link></li>
              <li><Link to="/albums">Albums</Link></li>
            </ul>
          </nav>
        </header>
        
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/albums" element={<Albums />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>CS230 Lab 3 - Premium Music Experience ✨</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
