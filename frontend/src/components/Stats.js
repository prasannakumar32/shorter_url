import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Stats.css';

function Stats() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/links/${code}`);
        
        if (!response.ok) {
          throw new Error('Link not found');
        }

        const data = await response.json();
        // Transform database field names to frontend field names
        const transformedData = {
          originalUrl: data.original_url,
          shortCode: data.short_code,
          clicks: data.click_count,
          createdAt: data.created_at,
          lastClicked: data.last_clicked
        };
        setStats(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchStats();
    }
  }, [code]);

  if (loading) {
    return <div className="stats-container">Loading...</div>;
  }

  if (error) {
    return <div className="stats-container">
      <div className="error-message">{error}</div>
    </div>;
  }

  if (!stats) {
    return <div className="stats-container">No stats available</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-card">
        <h2>Link Statistics</h2>
        <div className="stats-info">
          <div className="stat-item">
            <label>Original URL:</label>
            <span>{stats.originalUrl}</span>
          </div>
          <div className="stat-item">
            <label>Short Code:</label>
            <span>{stats.shortCode}</span>
          </div>
          <div className="stat-item">
            <label>Total Clicks:</label>
            <span>{stats.clicks}</span>
          </div>
          <div className="stat-item">
            <label>Created At:</label>
            <span>{new Date(stats.createdAt).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <label>Last Clicked:</label>
            <span>{stats.lastClicked ? new Date(stats.lastClicked).toLocaleString() : 'Never'}</span>
          </div>
        </div>
        <div className="back-link">
          <a href="/">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}

export default Stats;