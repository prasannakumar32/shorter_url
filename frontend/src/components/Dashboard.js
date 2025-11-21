import React, { useState, useEffect } from 'react';
import URLForm from './URLForm';
import URLTable from './URLTable';
import './Dashboard.css';

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async (searchTerm = '') => {
    try {
      const url = searchTerm 
        ? `http://localhost:5000/api/links?search=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:5000/api/links';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      const data = await response.json();
      const formattedData = data.map(url => ({
        id: url.id,
        originalUrl: url.original_url,
        shortCode: url.short_code,
        shortUrl: url.shortUrl || `http://localhost:5000/${url.short_code}`,
        clicks: url.click_count,
        createdAt: url.created_at,
        lastClicked: url.last_clicked
      }));
      setUrls(Array.isArray(formattedData) ? formattedData : []);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    fetchUrls(searchTerm);
  };

  const handleUrlCreated = (newUrl) => {
    console.log('New URL created:', newUrl); // Debug log
    const formattedUrl = {
      id: newUrl.id,
      originalUrl: newUrl.original_url,
      shortCode: newUrl.short_code,
      shortUrl: newUrl.shortUrl || `http://localhost:5000/${newUrl.short_code}`,
      clicks: newUrl.click_count,
      createdAt: newUrl.created_at,
      lastClicked: newUrl.last_clicked
    };
    console.log('Formatted URL:', formattedUrl); // Debug log
    setUrls([formattedUrl, ...urls]);
  };

  const handleDeleteUrl = (shortCode) => {
    setUrls(urls.filter(url => url.shortCode !== shortCode));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>URL Shortener Dashboard</h2>
        <p>Create and manage your shortened URLs</p>
        <div className="search-container">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by URL or code..."
            className="search-input"
          />
        </div>
      </div>
      
      <URLForm onUrlCreated={handleUrlCreated} />
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading URLs...</p>
        </div>
      ) : urls.length === 0 ? (
        <div className="empty-state">
          <h3>No URLs yet</h3>
          <p>Start by creating your first shortened URL above!</p>
        </div>
      ) : (
        <URLTable urls={urls} onDeleteUrl={handleDeleteUrl} onRefreshData={() => fetchUrls(search)} />
      )}
    </div>
  );
}

export default Dashboard;