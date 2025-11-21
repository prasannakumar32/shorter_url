const express = require('express');
const URLModel = require('../models/url');

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connectivity
    await URLModel.initTable();
    
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      server: 'running',
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      server: 'running',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;