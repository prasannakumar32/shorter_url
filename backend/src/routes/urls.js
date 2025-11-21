const express = require('express');
const { nanoid } = require('nanoid');
const URLModel = require('../models/url');
const { createError } = require('../middleware/errorHandler');
const { validateUrl, validateCustomCode } = require('../middleware/validation');

const router = express.Router();

// POST /api/urls - Create short URL
router.post('/', validateUrl, validateCustomCode, async (req, res, next) => {
  try {
    const { url, customCode } = req.body;

    let shortCode = customCode;

    if (customCode) {
      const exists = await URLModel.exists(customCode);
      if (exists) {
        return next(createError('Custom code already exists', 400));
      }
    } else {
      shortCode = nanoid(6);
      
      // Ensure uniqueness
      let exists = await URLModel.exists(shortCode);
      while (exists) {
        shortCode = nanoid(6);
        exists = await URLModel.exists(shortCode);
      }
    }

    const newUrl = await URLModel.create(url, shortCode);
    res.status(201).json(newUrl);
  } catch (error) {
    next(error);
  }
});

// GET /api/urls - Get all URLs with optional search
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const urls = await URLModel.findAll(search);
    res.json(urls);
  } catch (error) {
    next(error);
  }
});

// GET /api/urls/:code - Get single URL stats
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

// DELETE /api/urls/:code - Delete URL
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
