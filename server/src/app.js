const express = require('express');
const cors = require('cors');

const githubRoutes = require('./routes/github.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Allow all origins by default; in production set CORS_ORIGIN to the frontend
// URL (comma-separated for more than one).
const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }
  : {};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', githubRoutes);

// Unknown routes -> consistent 404 JSON.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
