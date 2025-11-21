import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import HealthCheck from './components/HealthCheck';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🔗 Shorter URL</h1>
          </div>
          <div className="nav-links">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/health" className="nav-link">Health</a>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<Stats />} />
            <Route path="/health" element={<HealthCheck />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
