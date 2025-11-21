import React, { useState, useEffect } from 'react';
import './HealthCheck.css';

function HealthCheck() {
  const [health, setHealth] = useState({
    status: 'checking',
    database: 'unknown',
    server: 'unknown',
    uptime: 0
  });

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      
      setHealth({
        status: data.status || 'healthy',
        database: data.database || 'connected',
        server: data.server || 'running',
        uptime: data.uptime || 0
      });
    } catch (error) {
      setHealth({
        status: 'unhealthy',
        database: 'disconnected',
        server: 'down',
        uptime: 0
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'running':
        return '#4CAF50';
      case 'unhealthy':
      case 'disconnected':
      case 'down':
        return '#f44336';
      default:
        return '#FF9800';
    }
  };

  return (
    <div className="health-check">
      <div className="health-header">
        <h2>System Health Check</h2>
        <p>Monitor the status of your application services</p>
      </div>
      
      <div className="health-cards">
        <div className="health-card">
          <h3>Overall Status</h3>
          <div className="status-indicator" style={{ backgroundColor: getStatusColor(health.status) }}>
            {health.status.toUpperCase()}
          </div>
        </div>
        
        <div className="health-card">
          <h3>Database</h3>
          <div className="status-indicator" style={{ backgroundColor: getStatusColor(health.database) }}>
            {health.database.toUpperCase()}
          </div>
        </div>
        
        <div className="health-card">
          <h3>Server</h3>
          <div className="status-indicator" style={{ backgroundColor: getStatusColor(health.server) }}>
            {health.server.toUpperCase()}
          </div>
        </div>
        
        <div className="health-card">
          <h3>Uptime</h3>
          <div className="uptime-display">
            {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m {health.uptime % 60}s
          </div>
        </div>
      </div>
      
      <div className="health-actions">
        <button onClick={checkHealth} className="refresh-btn">
          Refresh Status
        </button>
        <a href="/" className="back-btn">← Back to Dashboard</a>
      </div>
    </div>
  );
}

export default HealthCheck;