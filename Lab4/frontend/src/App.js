import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Therapists from './components/Therapists/Therapists';
import Clients from './components/Clients/Clients';
import Sessions from './components/Sessions/Sessions';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Therapist Client Management System</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/therapists">Therapists</Link></li>
              <li><Link to="/clients">Clients</Link></li>
              <li><Link to="/sessions">Sessions</Link></li>
            </ul>
          </nav>
        </header>
        
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/therapists" element={<Therapists />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/sessions" element={<Sessions />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>CS230 Assignment 4 - Therapist Client Management System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
