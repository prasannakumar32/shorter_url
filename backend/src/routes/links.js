const express = require('express');
const { nanoid } = require('nanoid');
const URLModel = require('../models/url');
const { createError } = require('../middleware/errorHandler');

const router = express.Router();

// Generate a more readable short code using a better character set
function generateShortCode(length = 6) {
  // Use a more URL-friendly character set (no ambiguous characters)
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// POST /api/links - Create link (409 if code exists)
router.post('/', async (req, res, next) => {
  try {
    const { url, customCode } = req.body;

    let shortCode = customCode;

    if (customCode) {
      // Validate custom code format
      if (!/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
        return next(createError('Custom code must be 6-8 characters, letters and numbers only', 400));
      }
      
      const exists = await URLModel.exists(customCode);
      if (exists) {
        return next(createError('Custom code already exists', 409));
      }
    } else {
      // Generate 6-character code with retry logic
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        shortCode = generateShortCode(6);
        attempts++;
        
        const exists = await URLModel.exists(shortCode);
        if (!exists) {
          break;
        }
        
        // If we've tried too many times, increase length
        if (attempts >= maxAttempts) {
          shortCode = generateShortCode(7);
          break;
        }
      } while (attempts < maxAttempts);
    }

    // Validate the original URL
    try {
      const urlObj = new URL(url);
      
      // Ensure the URL has a valid protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return next(createError('URL must use HTTP or HTTPS protocol', 400));
      }
      
      // Basic domain validation
      if (!urlObj.hostname) {
        return next(createError('URL must have a valid domain', 400));
      }
      
      // Optional: Block localhost URLs in production
      if (process.env.NODE_ENV === 'production') {
        const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
        if (blockedHosts.includes(urlObj.hostname)) {
          return next(createError('Localhost URLs are not allowed', 400));
        }
      }
      
    } catch (urlError) {
      return next(createError('Invalid URL format', 400));
    }

    const newUrl = await URLModel.create(url, shortCode);
    
    // Add the full short URL to the response
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const responseUrl = {
      ...newUrl,
      shortUrl: `${baseUrl}/${shortCode}`
    };
    
    res.status(201).json(responseUrl);
  } catch (error) {
    next(error);
  }
});

// GET /api/links - List all links
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const urls = await URLModel.findAll(search);
    res.json(urls);
  } catch (error) {
    next(error);
  }
});

// GET /api/links/:code - Stats for one code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const url = await URLModel.findByShortCode(code);
    
    if (!url) {
      return next(createError('URL not found', 404));
    }

    res.json(url);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/links/:code - Delete link
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const deleted = await URLModel.deleteByShortCode(code);
    
    if (!deleted) {
      return next(createError('URL not found', 404));
    }

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
