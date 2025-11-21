import React, { useState } from 'react';
import './URLForm.css';
import { API_ENDPOINTS } from '../config/api';

function URLForm({ onUrlCreated }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');

  const validateUrl = (inputUrl) => {
    if (!inputUrl.trim()) {
      setUrlError('URL is required');
      return false;
    }

    let cleanUrl = inputUrl.trim();
    
    // Add protocol if missing
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    try {
      const urlObj = new URL(cleanUrl);
      
      // Basic validation
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('URL must use HTTP or HTTPS protocol');
        return false;
      }
      
      if (!urlObj.hostname) {
        setUrlError('URL must have a valid domain');
        return false;
      }
      
      setUrlError('');
      return cleanUrl;
    } catch (urlError) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  };

  const validateCustomCode = (code) => {
    if (!code.trim()) {
      setCodeError('');
      return true; // Optional field
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(code.trim())) {
      setCodeError('Custom code must be 6-8 characters, letters and numbers only');
      return false;
    }

    setCodeError('');
    return true;
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    
    // Clear error as user types
    if (urlError) {
      setUrlError('');
    }
  };

  const handleCustomCodeChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, ''); // Only allow alphanumeric
    setCustomCode(value);
    
    // Clear error as user types
    if (codeError) {
      setCodeError('');
    }
  };

  const handleReset = () => {
    setUrl('');
    setCustomCode('');
    setError('');
    setSuccess('');
    setUrlError('');
    setCodeError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate URL
    const cleanUrl = validateUrl(url);
    if (!cleanUrl) {
      return;
    }

    // Validate custom code
    if (!validateCustomCode(customCode)) {
      return;
    }

    setLoading(true);

    try {
      const requestBody = { url: cleanUrl };
      if (customCode.trim()) {
        requestBody.customCode = customCode.trim();
      }

      const response = await fetch(API_ENDPOINTS.SHORTEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create short URL');
      }

      const data = await response.json();
      onUrlCreated(data);
      
      // Show success message
      setSuccess(`URL shortened successfully! ${data.shortUrl}`);
      
      // Reset form
      setUrl('');
      setCustomCode('');
      setUrlError('');
      setCodeError('');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-form">
      <h3>🔗 Create Short URL</h3>
      <p className="form-description">
        Enter a long URL to create a shortened link. Add a custom code for a personalized URL.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="url-input" className="input-label required">
                Long URL
              </label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com/very/long/url"
                className="url-input"
                disabled={loading}
                aria-describedby="url-hint url-error"
              />
              <div id="url-hint" className="input-hint info">
                💡 Enter the full URL you want to shorten
              </div>
              {urlError && (
                <div id="url-error" className="input-hint error">
                  ⚠️ {urlError}
                </div>
              )}
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="input-group">
              <label htmlFor="custom-code-input" className="input-label optional">
                Custom Code (Optional)
              </label>
              <input
                id="custom-code-input"
                type="text"
                value={customCode}
                onChange={handleCustomCodeChange}
                placeholder="e.g., docs"
                className="custom-code-input"
                disabled={loading}
                maxLength={8}
                aria-describedby="code-hint code-error char-counter"
              />
              <div id="code-hint" className="input-hint">
                🎨 6-8 characters, letters and numbers only
              </div>
              {codeError && (
                <div id="code-error" className="input-hint error">
                  ⚠️ {codeError}
                </div>
              )}
              <div id="char-counter" className={`char-counter ${customCode.length > 6 ? 'warning' : ''} ${customCode.length > 8 ? 'error' : ''}`}>
                {customCode.length}/8 characters
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={loading || !url.trim() || urlError || codeError}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Shortening...
              </>
            ) : (
              '🚀 Shorten URL'
            )}
          </button>
          
          <button
            type="button"
            className="secondary-btn"
            onClick={handleReset}
            disabled={loading}
          >
            🔄 Clear Form
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div className="success-message" role="status">
            ✅ {success}
          </div>
        )}
      </form>
    </div>
  );
}

export default URLForm;