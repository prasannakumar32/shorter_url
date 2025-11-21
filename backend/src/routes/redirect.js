const express = require('express');
const URLModel = require('../models/url');
const { createError } = require('../middleware/errorHandler');

const router = express.Router();

// GET /:code - Redirect to original URL
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    
    // Find the URL by short code
    const url = await URLModel.findByShortCode(code);
    
    if (!url) {
      return next(createError('URL not found', 404));
    }

    // Increment click count and update last clicked time atomically
    await URLModel.incrementClicks(code);

    // Perform 302 redirect
    res.redirect(302, url.original_url);
  } catch (error) {
    next(error);
  }
});

module.exports = router;