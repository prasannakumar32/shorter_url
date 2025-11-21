import React from 'react';
import './URLTable.css';
import { API_ENDPOINTS } from '../config/api';

function URLTable({ urls, onDeleteUrl, onRefreshData }) {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getShortUrl = (shortCode, shortUrl) => {
    return shortUrl || `${window.location.origin}/${shortCode}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const handleShortUrlClick = (shortCode) => {
    // Open the short URL in a new tab
    const shortUrl = getShortUrl(shortCode);
    window.open(shortUrl, '_blank');
    
    // Refresh data after 2 seconds to allow time for the redirect and click tracking
    setTimeout(() => {
      onRefreshData();
    }, 2000);
  };

  const handleDelete = async (shortCode) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_LINK(shortCode)}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete URL');
        }
        
        onDeleteUrl(shortCode);
      } catch (err) {
        alert('Error deleting URL: ' + err.message);
      }
    }
  };

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return (
      <div className="url-table-empty">
        <p>No URLs created yet. Start by shortening your first URL above!</p>
      </div>
    );
  }

  return (
    <div className="url-table">
      <h3>Your Shortened URLs</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Long URL</th>
              <th>Custom Code</th>
              <th>Shortened URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.filter(url => url && url.id).map((url) => (
              <tr key={url.id}>
                <td className="long-url">
                  <div className="url-display">
                    <a href={url.originalUrl || '#'} target="_blank" rel="noopener noreferrer" className="url-link">
                      {(url.originalUrl && url.originalUrl.length > 60) 
                        ? `${url.originalUrl.substring(0, 60)}...` 
                        : (url.originalUrl || 'N/A')}
                    </a>
                    <button 
                      onClick={() => url.originalUrl && copyToClipboard(url.originalUrl)}
                      className="copy-small-btn"
                      title="Copy long URL"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className="custom-code">
                  <div className="code-display">
                    <span className="code-text">{url.shortCode || 'N/A'}</span>
                    {url.shortCode && (
                      <button 
                        onClick={() => copyToClipboard(url.shortCode)}
                        className="copy-small-btn"
                        title="Copy custom code"
                      >
                        📋
                      </button>
                    )}
                  </div>
                </td>
                <td className="shortened-url">
                  <div className="url-display">
                    <button 
                      onClick={() => url.shortCode && handleShortUrlClick(url.shortCode)}
                      className="short-url-btn"
                      disabled={!url.shortCode}
                      title="Click to open and refresh data"
                    >
                      {url.shortCode ? getShortUrl(url.shortCode, url.shortUrl) : 'N/A'}
                    </button>
                    {url.shortCode && (
                      <button 
                        onClick={() => copyToClipboard(getShortUrl(url.shortCode, url.shortUrl))}
                        className="copy-small-btn"
                        title="Copy shortened URL"
                      >
                        📋
                      </button>
                    )}
                  </div>
                </td>
                <td className="clicks">{url.clicks || 0}</td>
                <td className="created">
                  {formatDate(url.createdAt)}
                </td>
                <td className="last-clicked">
                  {formatDate(url.lastClicked)}
                </td>
                <td className="actions">
                  <button 
                    onClick={() => url.shortCode && copyToClipboard(getShortUrl(url.shortCode, url.shortUrl))}
                    className="copy-btn"
                    disabled={!url.shortCode}
                    title="Copy URL"
                  >
                    📋
                  </button>
                  <a 
                    href={url.shortCode ? `/code/${url.shortCode}` : '#'}
                    className="stats-btn"
                    title="View Stats"
                  >
                    📊
                  </a>
                  <button 
                    onClick={() => url.shortCode && handleDelete(url.shortCode)}
                    className="delete-btn"
                    disabled={!url.shortCode}
                    title="Delete URL"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default URLTable;