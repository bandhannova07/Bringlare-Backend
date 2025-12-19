require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
const PORT = parseInt(process.env.PORT) || 3001;

// Security middleware
app.use(helmet());
app.use(express.json());

// CORS configuration - only allow Vercel frontend
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_POINTS) || 30, // requests
  duration: parseInt(process.env.RATE_LIMIT_DURATION) || 60 // per minute
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

app.use(rateLimiterMiddleware);

// SearXNG configuration
const SEARXNG_BASE_URL = process.env.SEARXNG_BASE_URL || 'http://searxng:8080';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q, page = 1, lang = 'en' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    // Construct SearXNG API URL
    const searchUrl = `${SEARXNG_BASE_URL}/search`;
    const params = {
      q,
      pageno: page,
      lang,
      format: 'json',
      results_on_new_tab: 1
    };
    
    // Make request to SearXNG
    const response = await axios.get(searchUrl, { 
      params,
      timeout: 10000 // 10 second timeout
    });
    
    // Transform SearXNG response to our format
    const results = response.data.results.map(result => ({
      title: result.title,
      url: result.url,
      snippet: result.content,
      engine: result.engine
    }));
    
    res.json({
      query: q,
      results,
      total: response.data.number_of_results || results.length
    });
    
  } catch (error) {
    console.error('Search error:', error.message);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timeout' });
    }
    
    if (error.response) {
      // SearXNG returned an error
      return res.status(error.response.status).json({ 
        error: 'Search service unavailable',
        message: error.response.statusText 
      });
    }
    
    // General error
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch search results'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Bringlare Search Backend listening on port ${PORT}`);
});